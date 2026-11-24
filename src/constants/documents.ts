export interface Ivideos {
  id: string;
  title: string;
  tag: string[];
  /** URL de embed de YouTube (clips legacy) */
  embed?: string;
  /** URL del archivo de video */
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt?: string;
}

export type EditVideos = {
  id: string;
  title: string;
  tag: string[];
  embed?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt?: string;
};

export type AddClipValues = {
  title: string;
  /** URL de embed YouTube — solo para clips legacy */
  embed?: string;
  /** URL del archivo de video */
  videoUrl?: string;
  thumbnailUrl?: string;
  tag: string[];
  createdAt?: string;
};

export type AddScreenShotValue = {
  name: string;
  file: File;
};
