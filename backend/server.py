import json
import logging
import mimetypes
import os
import re
import unicodedata
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional

import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Credenciais de acesso (alterar no ficheiro backend/.env)
AUTH_USERNAME = os.environ.get('AUTH_USERNAME', 'beatriz')
AUTH_PASSWORD = os.environ.get('AUTH_PASSWORD', 'amor2026')
JWT_SECRET = os.environ.get('JWT_SECRET', 'muda-este-segredo')
JWT_ALGORITHM = 'HS256'
TOKEN_DAYS = 30

# Pastas onde ficam os vídeos e as fotografias
MEDIA_DIR = Path(os.environ.get('MEDIA_DIR', ROOT_DIR / 'media'))
PHOTOS_DIR = MEDIA_DIR / 'photos'
VIDEOS_DIR = MEDIA_DIR / 'videos'
TITLES_FILE = MEDIA_DIR / 'titles.json'
for d in (PHOTOS_DIR, VIDEOS_DIR):
    d.mkdir(parents=True, exist_ok=True)

PHOTO_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.avif', '.bmp'}
VIDEO_EXTS = {'.mp4', '.webm', '.mov', '.m4v', '.ogg', '.mkv'}

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title='BA-Nextlix')
api_router = APIRouter(prefix='/api')
security = HTTPBearer(auto_error=False)


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    username: str


class MediaItem(BaseModel):
    id: str
    kind: str  # 'photo' ou 'video'
    title: str
    url: str
    added_at: Optional[str] = None


class MediaResponse(BaseModel):
    photos: List[MediaItem]
    videos: List[MediaItem]


class RenameRequest(BaseModel):
    title: str


def load_titles() -> dict:
    if TITLES_FILE.exists():
        try:
            return json.loads(TITLES_FILE.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, OSError):
            logger.warning('titles.json ilegível, a começar de novo')
    return {}


def save_titles(titles: dict) -> None:
    TITLES_FILE.write_text(
        json.dumps(titles, ensure_ascii=False, indent=2), encoding='utf-8'
    )


def pretty_title(filename: str) -> str:
    stem = Path(filename).stem
    stem = re.sub(r'[_\-]+', ' ', stem).strip()
    return stem.capitalize() if stem else filename


def safe_filename(filename: str) -> str:
    name = unicodedata.normalize('NFKD', filename)
    name = name.encode('ascii', 'ignore').decode('ascii')
    name = re.sub(r'[^A-Za-z0-9._\- ]+', '', name).strip().replace(' ', '_')
    return name or f'ficheiro_{uuid.uuid4().hex[:8]}'


def create_token(username: str) -> str:
    payload = {
        'sub': username,
        'exp': datetime.now(timezone.utc) + timedelta(days=TOKEN_DAYS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def require_auth(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> str:
    if credentials is None:
        raise HTTPException(status_code=401, detail='Sessão em falta')
    try:
        payload = jwt.decode(
            credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM]
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Sessão expirada')
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail='Sessão inválida')
    return payload['sub']


def list_dir(directory: Path, kind: str, exts: set, titles: dict) -> List[MediaItem]:
    items: List[MediaItem] = []
    for f in sorted(directory.iterdir(), key=lambda p: p.stat().st_mtime, reverse=True):
        if not f.is_file() or f.suffix.lower() not in exts:
            continue
        rel = f'{directory.name}/{f.name}'
        items.append(
            MediaItem(
                id=rel,
                kind=kind,
                title=titles.get(rel, pretty_title(f.name)),
                url=f'/api/files/{rel}',
                added_at=datetime.fromtimestamp(
                    f.stat().st_mtime, tz=timezone.utc
                ).isoformat(),
            )
        )
    return items


@api_router.get('/')
async def root():
    return {'message': 'BA-Nextlix API'}


@api_router.post('/login', response_model=LoginResponse)
async def login(body: LoginRequest):
    if (
        body.username.strip().lower() != AUTH_USERNAME.lower()
        or body.password != AUTH_PASSWORD
    ):
        raise HTTPException(
            status_code=401,
            detail='Nome de utilizador ou palavra-passe incorretos.',
        )
    return LoginResponse(token=create_token(body.username.strip()), username=body.username.strip())


@api_router.get('/me')
async def me(username: str = Depends(require_auth)):
    return {'username': username}


@api_router.get('/media', response_model=MediaResponse)
async def get_media(username: str = Depends(require_auth)):
    titles = load_titles()
    return MediaResponse(
        photos=list_dir(PHOTOS_DIR, 'photo', PHOTO_EXTS, titles),
        videos=list_dir(VIDEOS_DIR, 'video', VIDEO_EXTS, titles),
    )


@api_router.post('/media/upload', response_model=MediaItem)
async def upload_media(
    file: UploadFile = File(...),
    title: str = Form(''),
    username: str = Depends(require_auth),
):
    ext = Path(file.filename or '').suffix.lower()
    if ext in PHOTO_EXTS:
        kind, directory = 'photo', PHOTOS_DIR
    elif ext in VIDEO_EXTS:
        kind, directory = 'video', VIDEOS_DIR
    else:
        raise HTTPException(
            status_code=400,
            detail=f'Tipo de ficheiro não suportado: {ext or "desconhecido"}',
        )

    base = safe_filename(Path(file.filename).stem)
    name = f'{base}{ext}'
    dest = directory / name
    while dest.exists():
        name = f'{base}_{uuid.uuid4().hex[:6]}{ext}'
        dest = directory / name

    with dest.open('wb') as out:
        while chunk := await file.read(1024 * 1024):
            out.write(chunk)

    rel = f'{directory.name}/{name}'
    final_title = title.strip() or pretty_title(name)
    titles = load_titles()
    titles[rel] = final_title
    save_titles(titles)
    logger.info('Upload de %s por %s', rel, username)

    return MediaItem(
        id=rel,
        kind=kind,
        title=final_title,
        url=f'/api/files/{rel}',
        added_at=datetime.now(timezone.utc).isoformat(),
    )


def resolve_media_path(item_id: str) -> Path:
    folder, _, name = item_id.partition('/')
    if folder not in ('photos', 'videos') or not name or '/' in name or name in ('.', '..'):
        raise HTTPException(status_code=400, detail='Identificador inválido')
    path = (MEDIA_DIR / folder / name).resolve()
    if MEDIA_DIR.resolve() not in path.parents or not path.is_file():
        raise HTTPException(status_code=404, detail='Ficheiro não encontrado')
    return path


@api_router.put('/media/{folder}/{name}', response_model=MediaItem)
async def rename_media(
    folder: str, name: str, body: RenameRequest, username: str = Depends(require_auth)
):
    item_id = f'{folder}/{name}'
    path = resolve_media_path(item_id)
    titles = load_titles()
    titles[item_id] = body.title.strip() or pretty_title(name)
    save_titles(titles)
    kind = 'photo' if folder == 'photos' else 'video'
    return MediaItem(id=item_id, kind=kind, title=titles[item_id], url=f'/api/files/{item_id}')


@api_router.delete('/media/{folder}/{name}')
async def delete_media(folder: str, name: str, username: str = Depends(require_auth)):
    item_id = f'{folder}/{name}'
    path = resolve_media_path(item_id)
    path.unlink()
    titles = load_titles()
    if titles.pop(item_id, None) is not None:
        save_titles(titles)
    logger.info('%s apagou %s', username, item_id)
    return {'deleted': item_id}


mimetypes.add_type('video/mp4', '.m4v')
app.include_router(api_router)
app.mount('/api/files', StaticFiles(directory=MEDIA_DIR), name='files')

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)
