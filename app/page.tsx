'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import SlidingCard from './components/SlidingCard';
import { AnimeInfo, AnimeResult } from '@/utils/types';

export default function Home() {
  const [trending, setTrending] = useState<AnimeResult[] | null>(null);
  const [popular, setPopular] = useState<AnimeResult[] | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get('/api/trending?perPage=30');
        const data: AnimeInfo = response.data;
        setTrending(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchPopular = async () => {
      try {
        const response = await axios.get('/api/popular?perPage=30');
        const data: AnimeInfo = response.data;
        setPopular(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrending();
    fetchPopular();
  }, []);

  return (
    <div>
      {trending && popular ? (
        <div>
          <h1 className="text-3xl font-semibold">Trending Now</h1>
          <SlidingCard animeList={trending} />

          <h1 className="text-3xl font-semibold">All Time Popular</h1>
          <SlidingCard animeList={popular} />
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
