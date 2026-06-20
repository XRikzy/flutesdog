export interface Ivideos {
  id: string;
  title: string;
  tag: string[];
  /** URL de embed de YouTube (clips legacy) */
  embed?: string;
  /** URL de ImageKit (clips nuevos) */
  videoUrl?: string;
  createdAt?: string;
}

export type EditVideos = {
  id: string;
  title: string;
  tag: string[];
  embed?: string;
  videoUrl?: string;
  createdAt?: string;
};

export type AddClipValues = {
  title: string;
  /** URL de embed YouTube — solo para clips legacy */
  embed?: string;
  /** URL de ImageKit — para clips nuevos */
  videoUrl?: string;
  tag: string[];
  createdAt?: string;
};

export type AddScreenShotValue = {
  name: string;
  file: File;
};
