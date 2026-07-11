import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import {
  LoginPage,
  ProfileGate,
  NetflixHeader,
  HeroBanner,
  ContentRow,
  VideoModal,
  PhotoLightbox,
  UploadModal,
  Loading,
  Footer,
} from './components';

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/+$/, '');
const API = `${BACKEND_URL}/api`;
const TOKEN_KEY = 'ba_nextlix_token';

const absoluteUrl = (url) => (url.startsWith('http') ? url : `${BACKEND_URL}${url}`);

async function apiFetch(path, { token, ...options } = {}) {
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = 'Ocorreu um erro. Tenta novamente.';
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch (_) { /* resposta sem corpo JSON */ }
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function App() {
  // stage: 'boot' | 'login' | 'profiles' | 'browse'
  const [stage, setStage] = useState('boot');
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [profile, setProfile] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);

  const [media, setMedia] = useState({ photos: [], videos: [] });
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('inicio');

  const [playingVideo, setPlayingVideo] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setProfile(null);
    setMedia({ photos: [], videos: [] });
    setStage('login');
  }, []);

  const loadMedia = useCallback(async (authToken) => {
    const data = await apiFetch('/media', { token: authToken });
    const withSrc = (item) => ({ ...item, src: absoluteUrl(item.url) });
    setMedia({
      photos: data.photos.map(withSrc),
      videos: data.videos.map(withSrc),
    });
  }, []);

  // Arranque: valida a sessão guardada
  useEffect(() => {
    (async () => {
      if (!token) {
        setStage('login');
        return;
      }
      try {
        await loadMedia(token);
        setStage('profiles');
      } catch (err) {
        if (err.status === 401) {
          logout();
        } else {
          // Backend indisponível: mantém a sessão mas mostra o site vazio
          setStage('profiles');
        }
      }
    })();
    // corre apenas no arranque
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogin = async (username, password) => {
    setLoginBusy(true);
    setLoginError('');
    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      try {
        await loadMedia(data.token);
      } catch (_) { /* sem conteúdo ainda */ }
      setStage('profiles');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginBusy(false);
    }
  };

  const handleUploadFile = async (file, title) => {
    const form = new FormData();
    form.append('file', file);
    form.append('title', title || '');
    const res = await fetch(`${API}/media/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) {
      let detail = 'Falha no envio.';
      try {
        detail = (await res.json()).detail || detail;
      } catch (_) { /* sem corpo */ }
      throw new Error(detail);
    }
  };

  const handleUploadClose = async (didUpload) => {
    setUploadOpen(false);
    if (didUpload) {
      try {
        await loadMedia(token);
      } catch (_) { /* mantém a lista atual */ }
    }
  };

  const handleDelete = async (item) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Apagar “${item.title}” para sempre?`)) return;
    try {
      await apiFetch(`/media/${item.id}`, { method: 'DELETE', token });
      await loadMedia(token);
    } catch (err) {
      // eslint-disable-next-line no-alert
      window.alert(err.message);
    }
  };

  const openItem = (item) => {
    if (item.kind === 'video') {
      setPlayingVideo(item);
    } else {
      const idx = media.photos.findIndex((p) => p.id === item.id);
      setPhotoIndex(idx >= 0 ? idx : 0);
    }
  };

  const handleNav = (id) => {
    setActiveNav(id);
    const target = { videos: 'row-videos', fotos: 'row-fotos', lista: 'row-lista' }[id];
    if (target) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (stage === 'boot') return <Loading />;
  if (stage === 'login') {
    return <LoginPage onLogin={handleLogin} error={loginError} busy={loginBusy} />;
  }
  if (stage === 'profiles') {
    return (
      <ProfileGate
        onPick={(p) => {
          setProfile(p);
          setStage('browse');
        }}
      />
    );
  }

  const featured = media.videos[0] || media.photos[0] || null;
  const recent = [...media.videos, ...media.photos]
    .sort((a, b) => (b.added_at || '').localeCompare(a.added_at || ''))
    .slice(0, 12);

  return (
    <div className="bg-[#141414] min-h-screen">
      <NetflixHeader
        scrolled={scrolled}
        profile={profile}
        active={activeNav}
        onNav={handleNav}
        onUpload={() => setUploadOpen(true)}
        onLogout={logout}
        onSwitchProfile={() => setStage('profiles')}
      />

      <main>
        <HeroBanner
          item={featured}
          profile={profile}
          onPlay={openItem}
          onUpload={() => setUploadOpen(true)}
        />

        <div className="relative z-10 -mt-24 md:-mt-36 pb-8">
          <ContentRow
            rowId="row-lista"
            title="Adicionados recentemente"
            items={recent}
            onOpen={openItem}
            onDelete={handleDelete}
          />
          <ContentRow
            rowId="row-videos"
            title="Os Nossos Vídeos"
            items={media.videos}
            onOpen={openItem}
            onDelete={handleDelete}
          />
          <ContentRow
            rowId="row-fotos"
            title="As Nossas Fotografias"
            items={media.photos}
            onOpen={openItem}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <Footer />

      {playingVideo && (
        <VideoModal item={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}
      {photoIndex !== null && (
        <PhotoLightbox
          photos={media.photos}
          index={photoIndex}
          onIndex={setPhotoIndex}
          onClose={() => setPhotoIndex(null)}
        />
      )}
      {uploadOpen && <UploadModal onClose={handleUploadClose} onUpload={handleUploadFile} />}
    </div>
  );
}

export default App;
