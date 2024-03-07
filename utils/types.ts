interface AnimeInfo {
  currentPage: number;
  hasNextPage: boolean;
  results: AnimeResult[];
}

interface AnimeResult {
  id: string;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  imageHash: string;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
    thumbnailHash: string;
  };
  description: string;
  status: string;
  cover: string;
  coverHash: string;
  rating: number;
  releaseDate: number;
  color: string;
  genres: string[];
  totalEpisodes: number;
  duration: number;
  type: string;
}

interface AnimeData {
  id?: string;
  slug?: string;
  coverImage?: string;
  bannerImage?: string;
  trailer?: string;
  status?: string;
  season?: string;
  title?: {
    native?: string;
    romaji?: string;
    english?: string;
  };
  currentEpisode?: number;
  mappings?: {
    id?: string;
    providerId?: string;
    similarity?: number;
    providerType?: string;
  }[];
  synonyms?: string[];
  countryOfOrigin?: string;
  description?: string;
  duration?: number;
  color?: string;
  year?: number;
  rating?: {
    mal?: number;
    tmdb?: number;
    anidb?: number;
    kitsu?: number;
    anilist?: number;
  };
  popularity?: {
    mal?: number;
    tmdb?: number;
    anidb?: number;
    anilist?: number;
  };
  type?: string;
  format?: string;
  relations?: {
    id?: string;
    type?: string;
    title?: {
      native?: string;
      romaji?: string;
      english?: string | null;
    };
    format?: string;
    relationType?: string;
  }[];
  totalEpisodes?: number;
  genres?: string[];
  tags?: string[];
  episodes?: {
    data?: {
      episodes?: {
        id?: string;
        img?: string | null;
        title?: string;
        hasDub?: boolean;
        number?: number;
        rating?: number | null;
        isFiller?: boolean;
        updatedAt?: number;
        description?: string | null;
      }[];
      providerId?: string;
    }[];
    latest?: {
      updatedAt?: number;
      latestTitle?: string;
      latestEpisode?: number;
    };
  };
  averageRating?: number;
  averagePopularity?: number;
  artwork?: {
    img?: string;
    type?: string;
    providerId?: string;
  }[];
  characters?: {
    name?: string;
    image?: string;
    voiceActor?: {
      name?: string;
      image?: string;
    };
  }[];
}

export type { AnimeInfo, AnimeResult, AnimeData };
