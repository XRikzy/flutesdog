export const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/ru9ftzizk/";

export function withImageKitTransform(url: string, transform: string) {
  if (!url.startsWith(IMAGEKIT_ENDPOINT)) return url;
  const path = url.slice(IMAGEKIT_ENDPOINT.length).replace(/^tr:[^/]+\//, "");
  return `${IMAGEKIT_ENDPOINT}tr:${transform}/${path}`;
}
