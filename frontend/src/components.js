import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay, FaPlus, FaChevronLeft, FaChevronRight, FaTimes,
  FaHeart, FaSignOutAlt, FaCloudUploadAlt, FaTrash, FaSearch, FaBell, FaCaretDown
} from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/* Logótipo Netflix (wordmark e ícone "N")                             */
/* ------------------------------------------------------------------ */

// Wordmark desenhado em formas SVG (não depende de tipos de letra)
const LOGO_H = 120; // altura das letras
const LOGO_T = 26;  // espessura dos traços

const letterShapes = {
  N: {
    w: 66,
    shapes: (w, h, t) => [
      `0,0 ${t},0 ${t},${h} 0,${h}`,
      `${w - t},0 ${w},0 ${w},${h} ${w - t},${h}`,
      `0,0 ${t},0 ${w},${h} ${w - t},${h}`,
    ],
  },
  E: {
    w: 56,
    shapes: (w, h, t) => [
      `0,0 ${t},0 ${t},${h} 0,${h}`,
      `0,0 ${w},0 ${w},${t} 0,${t}`,
      `0,${(h - t) / 2} ${w - 6},${(h - t) / 2} ${w - 6},${(h + t) / 2} 0,${(h + t) / 2}`,
      `0,${h - t} ${w},${h - t} ${w},${h} 0,${h}`,
    ],
  },
  T: {
    w: 62,
    shapes: (w, h, t) => [
      `0,0 ${w},0 ${w},${t} 0,${t}`,
      `${(w - t) / 2},0 ${(w + t) / 2},0 ${(w + t) / 2},${h} ${(w - t) / 2},${h}`,
    ],
  },
  F: {
    w: 56,
    shapes: (w, h, t) => [
      `0,0 ${t},0 ${t},${h} 0,${h}`,
      `0,0 ${w},0 ${w},${t} 0,${t}`,
      `0,${(h - t) / 2} ${w - 6},${(h - t) / 2} ${w - 6},${(h + t) / 2} 0,${(h + t) / 2}`,
    ],
  },
  L: {
    w: 56,
    shapes: (w, h, t) => [
      `0,0 ${t},0 ${t},${h} 0,${h}`,
      `0,${h - t} ${w},${h - t} ${w},${h} 0,${h}`,
    ],
  },
  I: {
    w: 26,
    shapes: (w, h, t) => [`0,0 ${t},0 ${t},${h} 0,${h}`],
  },
  X: {
    w: 66,
    shapes: (w, h, t) => [
      `0,0 ${t},0 ${w},${h} ${w - t},${h}`,
      `${w - t},0 ${w},0 ${t},${h} 0,${h}`,
    ],
  },
};

export const NetflixLogo = ({ className = 'h-6 md:h-9' }) => {
  const word = 'NETFLIX';
  const gap = 14;
  let x = 0;
  const letters = word.split('').map((ch, i) => {
    const def = letterShapes[ch];
    const offset = x;
    x += def.w + gap;
    return (
      <g key={i} transform={`translate(${offset},0)`}>
        {def.shapes(def.w, LOGO_H, LOGO_T).map((pts, j) => (
          <polygon key={j} points={pts} />
        ))}
      </g>
    );
  });
  const total = x - gap;

  return (
    <svg
      viewBox={`0 0 ${total} ${LOGO_H}`}
      className={className}
      aria-label="NETFLIX"
      role="img"
      fill="#E50914"
    >
      {letters}
    </svg>
  );
};

export const NetflixNIcon = ({ className = 'h-8' }) => (
  <svg viewBox="0 0 111 200" className={className} aria-label="N" role="img">
    <defs>
      <linearGradient id="nfx-n-diag" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E50914" />
        <stop offset="100%" stopColor="#C11119" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="37" height="200" fill="#B1060F" />
    <rect x="74" y="0" width="37" height="200" fill="#B1060F" />
    <polygon points="0,0 37,0 111,200 74,200" fill="url(#nfx-n-diag)" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Página de entrada (login)                                           */
/* ------------------------------------------------------------------ */

export const LoginPage = ({ onLogin, error, busy }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!busy) onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 login-backdrop" />
      <div className="absolute inset-0 bg-black/60" />

      <header className="relative z-10 px-6 md:px-14 py-5">
        <NetflixLogo className="h-8 md:h-12" />
      </header>

      <div className="relative z-10 flex justify-center px-4 pb-16">
        <motion.form
          onSubmit={submit}
          className="w-full max-w-md bg-black/75 rounded px-8 md:px-16 py-12 mt-4 md:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-white text-3xl font-bold mb-7">Iniciar sessão</h1>

          <input
            type="text"
            autoFocus
            autoCapitalize="none"
            placeholder="Nome de utilizador"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#333] text-white rounded px-5 py-3.5 mb-4 outline-none focus:bg-[#454545] placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Palavra-passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#333] text-white rounded px-5 py-3.5 mb-2 outline-none focus:bg-[#454545] placeholder-gray-400"
          />

          {error && (
            <div className="bg-[#e87c03] text-white text-sm rounded px-4 py-3 mt-2 mb-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#E50914] hover:bg-[#f6121d] disabled:opacity-60 text-white font-bold rounded py-3.5 mt-6 transition-colors"
          >
            {busy ? 'A entrar…' : 'Entrar'}
          </button>

          <div className="flex items-center justify-between text-gray-400 text-sm mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-gray-400" />
              Lembrar-me
            </label>
            <span className="flex items-center gap-1">
              <FaHeart className="text-[#E50914]" /> Só para nós
            </span>
          </div>

          <p className="text-gray-500 text-sm mt-10">
            Primeira vez aqui?{' '}
            <span className="text-white">Pede o acesso a quem te ama.</span>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* "Quem está a ver?"                                                  */
/* ------------------------------------------------------------------ */

const PROFILES = [
  { name: 'Beatriz', colors: 'from-pink-500 to-red-600', emoji: '👩🏻' },
  { name: 'Miguel', colors: 'from-blue-500 to-indigo-700', emoji: '👨🏻' },
  { name: 'Nós os dois', colors: 'from-red-600 to-rose-900', emoji: '❤️' },
];

export const ProfileGate = ({ onPick }) => (
  <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-4">
    <motion.h1
      className="text-white text-3xl md:text-5xl mb-10 font-medium"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Quem está a ver?
    </motion.h1>
    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
      {PROFILES.map((p, i) => (
        <motion.button
          key={p.name}
          onClick={() => onPick(p)}
          className="group flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}
        >
          <div
            className={`w-24 h-24 md:w-36 md:h-36 rounded bg-gradient-to-br ${p.colors} flex items-center justify-center text-4xl md:text-6xl border-2 border-transparent group-hover:border-white transition-all`}
          >
            {p.emoji}
          </div>
          <span className="mt-3 text-gray-400 group-hover:text-white text-lg md:text-xl">
            {p.name}
          </span>
        </motion.button>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Cabeçalho                                                           */
/* ------------------------------------------------------------------ */

export const NetflixHeader = ({ scrolled, profile, onNav, active, onUpload, onLogout, onSwitchProfile }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id: 'inicio', label: 'Início' },
    { id: 'videos', label: 'Vídeos' },
    { id: 'fotos', label: 'Fotografias' },
    { id: 'lista', label: 'A Nossa Lista' },
  ];

  return (
    <motion.header
      className={`fixed top-0 w-full z-40 transition-colors duration-500 ${
        scrolled ? 'bg-[#141414]' : 'header-gradient'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between px-4 md:px-14 py-3.5">
        <div className="flex items-center gap-4 md:gap-10">
          <button onClick={() => onNav('inicio')} aria-label="Início">
            <NetflixLogo />
          </button>
          <nav className="hidden md:flex gap-5 text-sm">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => onNav(l.id)}
                className={`transition-colors ${
                  active === l.id
                    ? 'text-white font-semibold'
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-5 text-white">
          <FaSearch className="hidden sm:block cursor-pointer hover:text-gray-300" />
          <FaBell className="hidden sm:block cursor-pointer hover:text-gray-300" />
          <div
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button className="flex items-center gap-1.5" onClick={() => setMenuOpen((v) => !v)}>
              <div
                className={`w-8 h-8 rounded bg-gradient-to-br ${profile?.colors || 'from-red-600 to-rose-900'} flex items-center justify-center text-lg`}
              >
                {profile?.emoji || '❤️'}
              </div>
              <FaCaretDown className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="absolute right-0 top-full pt-3 w-56"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-black/95 border border-gray-800 rounded text-sm py-2">
                    <button
                      onClick={onUpload}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:underline"
                    >
                      <FaCloudUploadAlt className="text-lg" /> Adicionar vídeos/fotos
                    </button>
                    <button
                      onClick={onSwitchProfile}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:underline"
                    >
                      <FaHeart className="text-lg text-[#E50914]" /> Trocar de perfil
                    </button>
                    <div className="border-t border-gray-800 my-1" />
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:underline"
                    >
                      <FaSignOutAlt className="text-lg" /> Terminar sessão
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

/* ------------------------------------------------------------------ */
/* Miniatura (foto ou vídeo)                                           */
/* ------------------------------------------------------------------ */

const CardThumb = ({ item }) => {
  if (item.kind === 'video') {
    return (
      <video
        src={`${item.src}#t=0.5`}
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <img src={item.src} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
  );
};

export const MediaCard = ({ item, index, onOpen, onDelete }) => (
  <motion.div
    className="relative min-w-[45%] sm:min-w-[220px] md:min-w-[290px] cursor-pointer group/card"
    whileHover={{ scale: 1.06, zIndex: 20 }}
    transition={{ duration: 0.25 }}
    onClick={() => onOpen(item)}
  >
    <div className="relative aspect-video rounded overflow-hidden bg-[#181818]">
      <CardThumb item={item} />
      <div className="absolute top-1.5 left-1.5">
        <NetflixNIcon className="h-5 drop-shadow" />
      </div>
      {item.kind === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-black/50 border border-white flex items-center justify-center">
            <FaPlay className="text-white ml-1" />
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
        <h3 className="text-white text-sm font-semibold truncate">{item.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-green-400 text-xs font-semibold">
            {97 - (index % 4)}% de compatibilidade
          </span>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              aria-label={`Apagar ${item.title}`}
              className="text-gray-400 hover:text-white"
            >
              <FaTrash className="text-xs" />
            </button>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Fila de conteúdo                                                    */
/* ------------------------------------------------------------------ */

export const ContentRow = ({ title, items, onOpen, onDelete, rowId }) => {
  const scrollRef = useRef(null);
  if (!items?.length) return null;

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -600 : 600,
      behavior: 'smooth',
    });
  };

  return (
    <div className="mb-10" id={rowId}>
      <h2 className="text-[#e5e5e5] text-lg md:text-2xl font-bold mb-3 px-4 md:px-14">
        {title}
      </h2>
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-14 py-2"
        >
          {items.map((item, i) => (
            <MediaCard key={item.id} item={item} index={i} onOpen={onOpen} onDelete={onDelete} />
          ))}
        </div>
        <button
          onClick={() => scroll('left')}
          aria-label="Anterior"
          className="absolute left-0 top-0 bottom-0 w-12 bg-black/40 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        >
          <FaChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={() => scroll('right')}
          aria-label="Seguinte"
          className="absolute right-0 top-0 bottom-0 w-12 bg-black/40 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
        >
          <FaChevronRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Herói (destaque)                                                    */
/* ------------------------------------------------------------------ */

export const HeroBanner = ({ item, profile, onPlay, onUpload }) => {
  const heroTitle = item ? item.title : 'A Nossa História';
  const heroText = item
    ? 'Um original só nosso. Momentos que só nós entendemos, agora em exibição exclusiva.'
    : 'Ainda não há nada em cartaz. Adiciona os primeiros vídeos e fotografias para começar a nossa maratona.';

  return (
    <div className="relative h-[85vh] md:h-screen w-full overflow-hidden">
      {item ? (
        item.kind === 'video' ? (
          <video
            src={item.src}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.src})` }}
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2b0708] via-[#141414] to-black" />
      )}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 hero-gradient-bottom" />

      <div className="relative z-10 h-full flex items-center px-4 md:px-14">
        <div className="max-w-2xl">
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <NetflixNIcon className="h-7" />
            <span className="text-gray-300 tracking-[0.35em] text-sm font-semibold">
              SÉRIE ORIGINAL
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            className="text-base md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed drop-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {heroText}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            {item ? (
              <button
                onClick={() => onPlay(item)}
                className="flex items-center gap-3 bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded font-bold text-base md:text-lg hover:bg-gray-200 transition-colors"
              >
                <FaPlay /> Reproduzir
              </button>
            ) : (
              <button
                onClick={onUpload}
                className="flex items-center gap-3 bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded font-bold text-base md:text-lg hover:bg-gray-200 transition-colors"
              >
                <FaCloudUploadAlt /> Adicionar memórias
              </button>
            )}
            <button
              onClick={onUpload}
              className="flex items-center gap-3 bg-gray-500/60 text-white px-6 md:px-8 py-2.5 md:py-3 rounded font-bold text-base md:text-lg hover:bg-gray-500/40 transition-colors"
            >
              <FaPlus /> Mais conteúdo
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Reprodutor de vídeo                                                 */
/* ------------------------------------------------------------------ */

export const VideoModal = ({ item, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 md:p-6 video-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-3 right-3 z-10 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
          >
            <FaTimes />
          </button>
          <video src={item.src} className="w-full max-h-[80vh]" controls autoPlay playsInline />
          <div className="px-5 py-4">
            <h3 className="text-white text-lg md:text-xl font-bold">{item.title}</h3>
            <p className="text-green-400 text-sm font-semibold mt-1">
              100% de compatibilidade · Só para nós
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------ */
/* Galeria de fotografias (lightbox)                                   */
/* ------------------------------------------------------------------ */

export const PhotoLightbox = ({ photos, index, onClose, onIndex }) => {
  const prev = useCallback(
    () => onIndex((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndex]
  );
  const next = useCallback(
    () => onIndex((index + 1) % photos.length),
    [index, photos.length, onIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  if (index === null || !photos.length) return null;
  const photo = photos[index];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-10 w-11 h-11 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
        >
          <FaTimes />
        </button>
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Anterior"
              className="absolute left-2 md:left-6 z-10 w-11 h-11 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Seguinte"
              className="absolute right-2 md:right-6 z-10 w-11 h-11 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
            >
              <FaChevronRight />
            </button>
          </>
        )}
        <motion.figure
          key={photo.id}
          className="max-w-[92vw] max-h-[88vh] flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={photo.src}
            alt={photo.title}
            className="max-w-full max-h-[80vh] object-contain rounded"
          />
          <figcaption className="text-white text-base md:text-lg font-semibold mt-4">
            {photo.title}
            <span className="text-gray-400 font-normal ml-3 text-sm">
              {index + 1} / {photos.length}
            </span>
          </figcaption>
        </motion.figure>
      </motion.div>
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------ */
/* Upload de conteúdo                                                  */
/* ------------------------------------------------------------------ */

export const UploadModal = ({ onClose, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!files.length || busy) return;
    setBusy(true);
    setError('');
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(`A enviar ${i + 1} de ${files.length}…`);
        await onUpload(files[i], files.length === 1 ? title : '');
      }
      onClose(true);
    } catch (err) {
      setError(err.message || 'Falha no envio. Tenta outra vez.');
      setBusy(false);
      setProgress('');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !busy && onClose(false)}
      >
        <motion.form
          onSubmit={submit}
          className="w-full max-w-md bg-[#181818] rounded-lg p-7 border border-gray-800"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-white text-2xl font-bold mb-1">Adicionar memórias</h2>
          <p className="text-gray-400 text-sm mb-5">
            Vídeos (mp4, webm, mov…) e fotografias (jpg, png, heic…).
          </p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-600 hover:border-gray-400 rounded-lg py-8 flex flex-col items-center gap-2 text-gray-300 transition-colors"
          >
            <FaCloudUploadAlt className="text-4xl text-[#E50914]" />
            {files.length
              ? `${files.length} ficheiro(s) selecionado(s)`
              : 'Escolher ficheiros'}
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />

          {files.length === 1 && (
            <input
              type="text"
              placeholder="Título (ex.: O nosso primeiro jantar)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#333] text-white rounded px-4 py-3 mt-4 outline-none focus:bg-[#454545] placeholder-gray-500"
            />
          )}

          {progress && <p className="text-gray-300 text-sm mt-4">{progress}</p>}
          {error && <p className="text-[#e87c03] text-sm mt-4">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={!files.length || busy}
              className="flex-1 bg-[#E50914] hover:bg-[#f6121d] disabled:opacity-50 text-white font-bold rounded py-3 transition-colors"
            >
              {busy ? 'A enviar…' : 'Enviar'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onClose(false)}
              className="flex-1 bg-gray-600/60 hover:bg-gray-600/40 text-white font-bold rounded py-3 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------ */
/* Ecrã de carregamento                                                */
/* ------------------------------------------------------------------ */

export const Loading = () => (
  <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0.6 }}
        animate={{ scale: [0.9, 1.05, 1], opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <NetflixLogo className="h-14 md:h-20 mx-auto mb-8" />
      </motion.div>
      <div className="flex justify-center space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-[#E50914] rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Rodapé                                                              */
/* ------------------------------------------------------------------ */

export const Footer = () => (
  <footer className="px-4 md:px-14 py-10 text-gray-500 text-sm">
    <div className="flex items-center gap-2 mb-3">
      <FaHeart className="text-[#E50914]" />
      <span>Feito com amor · BA-Nextlix</span>
    </div>
    <p>Uma edição privada e exclusiva. Todos os momentos reservados.</p>
  </footer>
);
