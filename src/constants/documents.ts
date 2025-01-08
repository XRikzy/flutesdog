export interface Ivideos {
  id: string;
  title: string;
  tag: [];
  embed: string;
}
export type AddClipValues = {
  title: string;
  embed: string;
  tag: string[];
};

export type DeleteClipValue = {
  id: string;
};
