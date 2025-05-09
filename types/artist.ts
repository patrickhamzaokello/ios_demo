export interface MwonyaArtistDetailsResponse {
    page: number;
    Artist: Artist[];
    total_pages: number;
    total_results: number;
  }
  
  export type Artist = 
    | ArtistIntroSection
    | ArtistPickSection
    | ArtistTrendingSection
    | ArtistReleaseSection
    | ArtistRelatedSection
    | ArtistEventsSection
    | ArtistBioSection;
  
  export interface ArtistIntroSection {
    ArtistIntro: ArtistIntroData[];
    Type: "intro";
  }
  
  export interface ArtistIntroData {
    id: string;
    name: string;
    profilephoto: string;
    coverimage: string;
    monthly: string;
    verified: boolean;
    user_access_exclusive: boolean;
    circle_cost: number;
    circle_duration: number;
    circle_cost_maximum: number;
    following: boolean;
    intro: string;
  }
  
  export interface ArtistPickSection {
    heading: string;
    Type: "pick";
    ArtistPick: ArtistPickData[];
  }
  
  export interface ArtistPickData {
    id: string;
    type: string;
    out_now: string;
    coverimage: string;
    song_title: string;
    exclusive: boolean;
    song_cover: string;
  }
  
  export interface ArtistTrendingSection {
    heading: string;
    Type: "trending";
    Tracks: Track[];
  }
  
  export interface Track {
    id: string;
    title: string;
    artist: string;
    artistID: string;
    album: string;
    artworkPath: string;
    genre: string;
    genreID: string;
    duration: string;
    lyrics: string | null;
    path: string;
    totalplays: number;
    albumID: string;
  }
  
  export interface ArtistReleaseSection {
    heading: string;
    Type: "release";
    ArtistAlbum: Album[];
  }
  
  export interface Album {
    id: string;
    title: string;
    artist: string;
    genre: string;
    artworkPath: string;
    tag: string;
    exclusive: boolean;
    description: string;
    datecreated: string;
    totalsongplays: string;
  }
  
  export interface ArtistRelatedSection {
    heading: string;
    Type: "related_artist";
    RelatedArtist: RelatedArtist[];
  }
  
  export interface RelatedArtist {
    id: string;
    name: string;
    verified: boolean;
    genre: string;
    profilephoto: string;
  }
  
  export interface ArtistEventsSection {
    heading: string;
    Type: "events";
    Events: any[]; // Empty array in the provided data
  }
  
  export interface ArtistBioSection {
    heading: string;
    Type: "bio";
    Bio: ArtistBioData[];
  }
  
  export interface ArtistBioData {
    id: string;
    name: string;
    email: string;
    phone: string;
    facebookurl: string;
    twitterurl: string;
    instagramurl: string;
    RecordLable: string;
    profilephoto: string;
    coverimage: string;
    bio: string;
    genre: string;
    datecreated: string;
    tag: string;
    overalplays: string;
    monthly: string;
    status: string;
    verified: boolean;
  }