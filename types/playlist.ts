export interface Track {
    id: string;
    title: string;
    artist: string;
    artistID: string;
    album: string;
    artworkPath: string;
    genre: string | null;
    genreID: string | null;
    duration: string;
    lyrics: string | null;
    path: string;
    totalplays: number;
    albumID: string;
    date_duration?: string | null;
  }
  
  export interface Playlist {
    id: string;
    name: string;
    owner: string;
    cover: string;
    description: string;
    status: string;
    total: number;
    Tracks?: Track[];
  }
  
  export interface MwonyaPlaylistDetailsResponse {
    page: number;
    Playlists: Playlist[];
    total_pages: number;
    total_results: number;
  }