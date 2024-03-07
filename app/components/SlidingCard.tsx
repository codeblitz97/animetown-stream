'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { AnimeData, AnimeResult } from '@/utils/types';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  animeList: AnimeResult[];
};

export default function SlidingCard({ animeList }: Readonly<Props>) {
  const [info, setInfo] = useState<AnimeData | null>(null);
  const [prevEndpoint, setPrevEndpoint] = useState<string | null>(null);
  const [cachedData, setCachedData] = useState<{ [key: string]: AnimeData }>(
    {}
  );
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [delayCompleted, setDelayCompleted] = useState(false);

  const handleVideoHover = async (hovered: boolean, id: number | null) => {
    setIsHovered(hovered);
    setHoveredId(id);

    if (hovered && id !== null) {
      setTimeout(async () => {
        setDelayCompleted(true);
        const anime = animeList.find((a) => Number(a.id) === id);
        if (anime) {
          await handleRequest(anime.id);
          await fetchTrailer(anime.trailer?.id ?? '');
        }
      }, 3000);
    } else {
      setDelayCompleted(false);
    }
  };

  const handleRequest = async (id: string) => {
    if (prevEndpoint === `/api/info?id=${id}`) {
      console.warn('The request was made previously so using cache.');
      setInfo(cachedData[prevEndpoint]);
    } else {
      console.log('Sending request as no cache with this id was found.');
      const response = await axios.get(`/api/info?id=${id}`);
      const newData = response.data;
      setInfo(newData);
      setCachedData((prevData) => ({
        ...prevData,
        [`/api/info?id=${id}`]: newData,
      }));
      setPrevEndpoint(`/api/info?id=${id}`);
    }
  };

  const clearState = () => {
    setInfo(null);
    setHoveredId(null);
    setIsHovered(false);
    setTrailer(null);
    setDelayCompleted(true);
  };

  async function fetchTrailer(trailerId: string | undefined) {
    try {
      console.log(trailerId);
      if (trailerId) {
        const response = await axios.get(
          `https://pipedapi.kavin.rocks/streams/${trailerId}`
        );
        console.log('Url', `https://pipedapi.kavin.rocks/streams/${trailerId}`);
        const item = response.data.videoStreams.find(
          (i: any) => i.quality === '1080p' && i.format === 'WEBM'
        );
        setTrailer(item?.url || null);
      } else {
        setTrailer(null);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      setTrailer(null);
    }
  }
  return (
    <div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="mb-2"
      >
        {animeList.map((anime) => {
          return (
            <SwiperSlide
              className="cursor-pointer"
              key={anime.id}
              onClick={() => (window.location.href = `/info/${anime.id}`)}
            >
              <motion.div
                className="h-[390px]"
                onHoverStart={() => {
                  setHoveredId(Number(anime.id));
                  handleVideoHover(true, Number(anime.id));
                }}
                onHoverEnd={() => {
                  setHoveredId(null);
                  handleVideoHover(false, Number(anime.id));
                  clearState();
                }}
              >
                <div className="relative h-80">
                  <Image
                    src={anime.cover}
                    alt={anime.title.native}
                    width={3048}
                    height={3048}
                    className="w-full h-full object-cover rounded-lg"
                    priority={true}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 duration-200 hover:blur-[2px]"></div>
                  <AnimatePresence>
                    {hoveredId === Number(anime.id) && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-0 left-0 right-0 p-4 text-green-100 pointer-events-none"
                      >
                        <div className="text-sm text-center">
                          {`${anime?.totalEpisodes} episodes • ${anime?.type} • ${anime?.status} • ${anime?.duration}`}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {info ? (
                    <div className="absolute inset-0">
                      <AnimatePresence>
                        {isHovered && hoveredId === Number(anime.id) ? (
                          trailer !== null || delayCompleted ? (
                            <motion.video
                              src={trailer as string}
                              preload="auto"
                              autoPlay
                              muted
                              className="w-full h-full object-cover rounded-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            ></motion.video>
                          ) : (
                            <motion.div
                              className="absolute inset-0"
                              initial={{ opacity: 1, visibility: 'visible' }}
                              animate={
                                isHovered && hoveredId === Number(anime.id)
                                  ? { opacity: 0, visibility: 'hidden' }
                                  : { opacity: 1, visibility: 'visible' }
                              }
                              exit={{ opacity: 0, visibility: 'hidden' }}
                            >
                              <Image
                                src={anime.cover}
                                alt={anime.title.native}
                                width={3048}
                                height={3048}
                                className="w-full h-full object-cover rounded-lg"
                                priority={true}
                              />
                            </motion.div>
                          )
                        ) : (
                          <Image
                            src={anime.cover}
                            alt={anime.title.native}
                            width={3048}
                            height={3048}
                            className="w-full h-full object-cover rounded-lg"
                            priority={true}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-semibold">
                    {anime.title.english}
                  </h1>
                  <div style={{ color: `${anime.color ?? 'green'}` }}>
                    <span>{anime.releaseDate}</span>
                    <span> • </span>
                    <span>{anime.title.romaji}</span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
