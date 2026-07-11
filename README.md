# Nextlix ❤️

Um site com o visual da Netflix, mas privado: vídeos e fotografias pessoais, protegidos por nome de utilizador e palavra-passe.

## O que tem

- **Página de login** ao estilo Netflix (utilizador + palavra-passe)
- Ecrã **"Quem está a ver?"** com perfis (Miguel, Convidado)
- **Página principal** com logótipo, banner em destaque e filas de conteúdo:
  - Adicionados recentemente
  - Os Nossos Vídeos
  - As Nossas Fotografias
- **Reprodutor de vídeo** em ecrã grande e **galeria de fotografias** (setas ← →)
- **Upload no browser**: menu do perfil (canto superior direito) → "Adicionar vídeos/fotos"
- Também dá para **apagar** conteúdo (ícone do caixote ao passar o rato num cartão)

## Credenciais de acesso

Estão no ficheiro `backend/.env` — **muda-as antes de partilhar o site**:

```
AUTH_USERNAME="miguel"
AUTH_PASSWORD="amor2026"
JWT_SECRET="nextlix-troca-este-segredo"
```

## Como adicionar vídeos e fotografias

Há duas formas:

1. **No site**: inicia sessão → menu do perfil → "Adicionar vídeos/fotos".
2. **Nas pastas**: copia os ficheiros diretamente para
   - `backend/media/videos/` (mp4, webm, mov, m4v…)
   - `backend/media/photos/` (jpg, png, webp, heic…)

   O nome do ficheiro vira o título (ex.: `primeiro_jantar.mp4` → "Primeiro jantar").

## Como correr localmente

**Backend** (FastAPI):

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

**Frontend** (React):

```bash
cd frontend
yarn install
yarn start
```

O frontend fala com o backend através da variável `REACT_APP_BACKEND_URL` em `frontend/.env`.
Para desenvolvimento local, usa `REACT_APP_BACKEND_URL=http://localhost:8001`.
