import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPlus, FaThumbsUp, FaThumbsDown, FaChevronDown, FaChevronLeft, FaChevronRight, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

// TMDB API Configuration
const TMDB_API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];
let currentApiKeyIndex = 0;

const getApiKey = () => TMDB_API_KEYS[currentApiKeyIndex];
const rotateApiKey = () => {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % TMDB_API_KEYS.length;
};

// Netflix Images
const netflixImages = [
  'https://images.unsplash.com/photo-1577490621716-b1aa5f091524?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxjaW5lbWF8ZW58MHx8fHJlZHwxNzUyMzI1OTA3fDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1551558493-23ad82b16536?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxjaW5lbWF8ZW58MHx8fHJlZHwxNzUyMzI1OTA3fDA&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/15357883/pexels-photo-15357883.jpeg',
  'https://images.pexels.com/photos/12261166/pexels-photo-12261166.jpeg',
  'https://images.unsplash.com/photo-1503095396549-807759245b35?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxmaWxtfGVufDB8fHxyZWR8MTc1MjM0Nzg2Mnww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1584034140774-4aacb37bc12b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxmaWxtfGVufDB8fHxyZWR8MTc1MjM0Nzg2Mnww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1568379683367-170a4aad7f1b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxmaWxtfGVufDB8fHxyZWR8MTc1MjM0Nzg2Mnww&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/7206581/pexels-photo-7206581.jpeg',
  'https://images.pexels.com/photos/7563612/pexels-photo-7563612.jpeg',
  'https://images.pexels.com/photos/7563609/pexels-photo-7563609.jpeg',
  'https://images.pexels.com/photos/7564232/pexels-photo-7564232.jpeg',
  'https://images.pexels.com/photos/15357888/pexels-photo-15357888.jpeg',
  'https://images.pexels.com/photos/7206410/pexels-photo-7206410.jpeg'
];

// Mock movie data when API fails
const mockMovies = [
  {
    id: 1,
    title: "Stranger Things",
    overview: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    backdrop_path: netflixImages[0],
    poster_path: netflixImages[1],
    vote_average: 8.7,
    release_date: "2016-07-15",
    genres: ["Drama", "Fantasy", "Horror"],
    youtubeKey: "b9EkMc79ZSU"
  },
  {
    id: 2,
    title: "The Witcher",
    overview: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
    backdrop_path: netflixImages[2],
    poster_path: netflixImages[3],
    vote_average: 8.2,
    release_date: "2019-12-20",
    genres: ["Action", "Adventure", "Fantasy"],
    youtubeKey: "ndl1W4ltcmg"
  },
  {
    id: 3,
    title: "Money Heist",
    overview: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    backdrop_path: netflixImages[4],
    poster_path: netflixImages[5],
    vote_average: 8.3,
    release_date: "2017-05-02",
    genres: ["Crime", "Drama", "Mystery"],
    youtubeKey: "hMANIarjT50"
  }
];

// Netflix Header Component
export const NetflixHeader = ({ scrolled }) => {
  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-4 md:px-16 py-4">
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-2xl md:text-4xl font-bold">NETFLIX</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">TV Shows</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Movies</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">New & Popular</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">My List</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-red-600 rounded"></div>
        </div>
      </div>
    </motion.header>
  );
};

// Hero Banner Component
export const HeroBanner = ({ featuredContent, onPlayTrailer }) => {
  if (!featuredContent) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${featuredContent.backdrop_path})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      <div className="relative z-10 h-full flex items-center px-4 md:px-16">
        <div className="max-w-2xl">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {featuredContent.title}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {featuredContent.overview}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button 
              onClick={() => onPlayTrailer(featuredContent)}
              className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded font-bold text-lg hover:bg-gray-200 transition-colors"
            >
              <FaPlay className="text-xl" />
              Play
            </button>
            <button className="flex items-center gap-3 bg-gray-500/70 text-white px-8 py-3 rounded font-bold text-lg hover:bg-gray-500/50 transition-colors">
              <FaPlus className="text-xl" />
              More Info
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Content Card Component
export const ContentCard = ({ item, onHover, onLeave, onPlayTrailer, isHovered }) => {
  return (
    <motion.div
      className="relative min-w-[200px] md:min-w-[300px] cursor-pointer"
      onMouseEnter={() => onHover(item)}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <img 
          src={item.poster_path || item.backdrop_path} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-white font-bold text-sm md:text-base mb-2">{item.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayTrailer(item);
                  }}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <FaPlay className="text-black text-xs ml-0.5" />
                </button>
                <button className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                  <FaPlus className="text-gray-400 hover:text-white text-xs" />
                </button>
                <button className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                  <FaThumbsUp className="text-gray-400 hover:text-white text-xs" />
                </button>
              </div>
              <div className="text-green-400 text-xs font-semibold mb-1">
                {Math.round(item.vote_average * 10)}% Match
              </div>
              <div className="text-gray-300 text-xs">
                {item.genres?.slice(0, 3).join(' • ')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Content Row Component
export const ContentRow = ({ title, items, onPlayTrailer }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-16">{title}</h2>
      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-16 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onHover={setHoveredItem}
              onLeave={() => setHoveredItem(null)}
              onPlayTrailer={onPlayTrailer}
              isHovered={hoveredItem?.id === item.id}
            />
          ))}
        </div>
        
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <FaChevronLeft />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

// Video Player Modal Component
export const VideoPlayer = ({ isOpen, onClose, videoKey, title }) => {
  const [isMuted, setIsMuted] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <FaTimes />
          </button>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>

          <div className="absolute bottom-4 left-4 z-10 text-white">
            <h3 className="text-lg font-bold">{title}</h3>
          </div>

          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Loading Component
export const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-red-600 text-6xl font-bold mb-8">NETFLIX</div>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-red-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};