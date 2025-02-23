export interface Track {
  id: string;
  title: string;
  artist: string;
  artworkPath: string;
  path: string;
}

export interface Artist {
  id: string;
  name: string;
  profilephoto: string;
  verified: boolean;
}

export interface Release {
  id: string;
  title: string;
  artist: string;
  artworkPath: string;
  tag: string;
}

export interface AlbumCollection {
  id: string;
  title: string;
  artist: string;
  description: string;
  artworkPath: string;
  exclusive: boolean;
  artistImage: string;
  tag: string;
  genre: string;
}

export interface PlaylistDetail {
  
    id: string,
    name: string,
    owner: string,
    exclusive: boolean,
    coverurl: string
}


export interface SliderBanner {
  id: number;
  playlistID: string;
  imagepath: string;
}


export interface Section {
  type: 'hero' | 'slider' | 'newRelease' | 'artist' | 'trend' | 'slider' | 'albums'| 'playlist' | 'artist_more_like' | 'djs';
  heading: string;
  subheading?: string;
  HomeRelease?: Release[];
  featuredAlbums?: AlbumCollection[];
  FeaturedDjMixes?: AlbumCollection[];
  featuredArtists?: Artist[];
  featuredPlaylists?: PlaylistDetail[];
  Tracks?: Track[];
  featured_sliderBanners?: SliderBanner[];
}

export interface HomeData {
  featured: Section[];
}