import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  NetflixHeader, 
  HeroBanner, 
  ContentRow, 
  VideoPlayer, 
  Loading 
} from './components';

const TMDB_API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];
let currentApiKeyIndex = 0;

const getApiKey = () => TMDB_API_KEYS[currentApiKeyIndex];
const rotateApiKey = () => {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % TMDB_API_KEYS.length;
};

// Netflix Images for fallback
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

// Mock data for fallback
const mockMovieData = {
  trending: [
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
    },
    {
      id: 4,
      title: "Breaking Bad",
      overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
      backdrop_path: netflixImages[6],
      poster_path: netflixImages[7],
      vote_average: 9.5,
      release_date: "2008-01-20",
      genres: ["Crime", "Drama", "Thriller"],
      youtubeKey: "HhesaQXLuRY"
    },
    {
      id: 5,
      title: "The Crown",
      overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
      backdrop_path: netflixImages[8],
      poster_path: netflixImages[9],
      vote_average: 8.6,
      release_date: "2016-11-04",
      genres: ["Biography", "Drama", "History"],
      youtubeKey: "JWtnJjn6ng0"
    }
  ],
  popular: [
    {
      id: 6,
      title: "Squid Game",
      overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize, but the stakes are deadly.",
      backdrop_path: netflixImages[10],
      poster_path: netflixImages[11],
      vote_average: 8.0,
      release_date: "2021-09-17",
      genres: ["Action", "Drama", "Mystery"],
      youtubeKey: "oqxAJKy0ii4"
    },
    {
      id: 7,
      title: "Ozark",
      overview: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.",
      backdrop_path: netflixImages[12],
      poster_path: netflixImages[0],
      vote_average: 8.4,
      release_date: "2017-07-21",
      genres: ["Crime", "Drama", "Thriller"],
      youtubeKey: "5hAXVqrljbs"
    },
    {
      id: 8,
      title: "Dark",
      overview: "A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.",
      backdrop_path: netflixImages[1],
      poster_path: netflixImages[2],
      vote_average: 8.8,
      release_date: "2017-12-01",
      genres: ["Crime", "Drama", "Mystery"],
      youtubeKey: "rrwycJ08PSA"
    }
  ],
  topRated: [
    {
      id: 9,
      title: "The Queen's Gambit",
      overview: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while struggling with addiction.",
      backdrop_path: netflixImages[3],
      poster_path: netflixImages[4],
      vote_average: 8.6,
      release_date: "2020-10-23",
      genres: ["Drama"],
      youtubeKey: "CDrieqwSdgI"
    },
    {
      id: 10,
      title: "Narcos",
      overview: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country through the years.",
      backdrop_path: netflixImages[5],
      poster_path: netflixImages[6],
      vote_average: 8.8,
      release_date: "2015-08-28",
      genres: ["Biography", "Crime", "Drama"],
      youtubeKey: "xl8zdCY-abw"
    }
  ]
};

function App() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [featuredContent, setFeaturedContent] = useState(null);
  const [contentData, setContentData] = useState({
    trending: [],
    popular: [],
    topRated: []
  });
  const [videoPlayer, setVideoPlayer] = useState({
    isOpen: false,
    videoKey: '',
    title: ''
  });

  // Fetch data from TMDB API
  const fetchMovieData = async () => {
    try {
      const apiKey = getApiKey();
      
      // Fetch trending movies
      const trendingResponse = await fetch(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`
      );
      
      if (!trendingResponse.ok) {
        throw new Error('API request failed');
      }
      
      const trendingData = await trendingResponse.json();
      
      // Fetch popular movies
      const popularResponse = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
      );
      const popularData = await popularResponse.json();
      
      // Fetch top rated movies
      const topRatedResponse = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
      );
      const topRatedData = await topRatedResponse.json();

      // Process the data and add Netflix images + YouTube keys
      const processContent = (items, imageOffset = 0) => {
        return items.slice(0, 10).map((item, index) => ({
          ...item,
          title: item.title || item.name,
          backdrop_path: item.backdrop_path 
            ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
            : netflixImages[(index + imageOffset) % netflixImages.length],
          poster_path: item.poster_path 
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : netflixImages[(index + imageOffset + 1) % netflixImages.length],
          genres: ["Action", "Drama", "Thriller"], // Mock genres
          youtubeKey: ["b9EkMc79ZSU", "ndl1W4ltcmg", "hMANIarjT50", "HhesaQXLuRY", "JWtnJjn6ng0"][index % 5]
        }));
      };

      const processedData = {
        trending: processContent(trendingData.results, 0),
        popular: processContent(popularData.results, 3),
        topRated: processContent(topRatedData.results, 6)
      };

      setContentData(processedData);
      setFeaturedContent(processedData.trending[0]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      rotateApiKey();
      
      // Use mock data as fallback
      setContentData(mockMovieData);
      setFeaturedContent(mockMovieData.trending[0]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      await fetchMovieData();
      setTimeout(() => setLoading(false), 2000); // Show loading for 2 seconds
    };

    initializeApp();
  }, []);

  const handlePlayTrailer = (content) => {
    setVideoPlayer({
      isOpen: true,
      videoKey: content.youtubeKey || 'b9EkMc79ZSU',
      title: content.title
    });
  };

  const closeVideoPlayer = () => {
    setVideoPlayer({
      isOpen: false,
      videoKey: '',
      title: ''
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-black min-h-screen">
      <NetflixHeader scrolled={scrolled} />
      
      <main>
        <HeroBanner 
          featuredContent={featuredContent} 
          onPlayTrailer={handlePlayTrailer}
        />
        
        <div className="relative z-10 -mt-32">
          <ContentRow 
            title="Trending Now" 
            items={contentData.trending}
            onPlayTrailer={handlePlayTrailer}
          />
          <ContentRow 
            title="Popular on Netflix" 
            items={contentData.popular}
            onPlayTrailer={handlePlayTrailer}
          />
          <ContentRow 
            title="Top Rated" 
            items={contentData.topRated}
            onPlayTrailer={handlePlayTrailer}
          />
        </div>
      </main>

      <VideoPlayer
        isOpen={videoPlayer.isOpen}
        onClose={closeVideoPlayer}
        videoKey={videoPlayer.videoKey}
        title={videoPlayer.title}
      />
    </div>
  );
}

export default App;