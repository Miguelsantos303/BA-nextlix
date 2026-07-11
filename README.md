# Nextlix ❤️

Um site com o visual da Netflix, mas privado: vídeos e fotografias pessoais, protegidos por nome de utilizador e palavra-passe.

## O que tem

- **Página de login** ao estilo Netflix (utilizador + palavra-passe)
- Ecrã **"Quem está a ver?"** com perfis (Miguel, Ana, Nós os dois)
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

## Como pôr a correr no computador de casa

Só precisas de instalar duas coisas (uma única vez):

1. **Node.js** — https://nodejs.org (versão LTS)
2. **Python 3** — https://www.python.org/downloads (no Windows, marca **"Add Python to PATH"** ao instalar)

Depois descarrega este projeto (`Code → Download ZIP` no GitHub, ou `git clone`) e:

- **Windows**: duplo clique em **`iniciar.bat`**
- **Mac/Linux**: `./iniciar.sh`

Na primeira vez demora uns minutos (compila o site); depois arranca em segundos.
No fim aparece no ecrã o endereço para abrir:

- no próprio computador: `http://localhost:8001`
- no iPhone/telemóvel (mesma rede Wi-Fi): `http://IP-do-computador:8001`

A partir do telemóvel podes fazer upload das fotografias e vídeos diretamente do rolo da câmara (menu do perfil → "Adicionar vídeos/fotos"). Ficam guardados no computador, na pasta `backend/media/`.

### Aceder fora de casa (opcional)

A forma mais simples e segura é o **Tailscale** (grátis para uso pessoal):

1. Instala o Tailscale no computador de casa e no iPhone (https://tailscale.com)
2. Entra com a mesma conta nos dois
3. No iPhone, abre `http://nome-do-computador:8001` — funciona em qualquer lado, sem mexer no router

### Para programadores

Backend e frontend também correm em separado:

```bash
cd backend && pip install -r requirements.txt && uvicorn server:app --port 8001
cd frontend && yarn install && REACT_APP_BACKEND_URL=http://localhost:8001 yarn start
```

O servidor FastAPI serve automaticamente o site compilado (`frontend/build`) quando este existe — por isso em produção basta o `uvicorn`.
