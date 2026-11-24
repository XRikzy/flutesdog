import { useState } from "react";
import type { CollectionValues } from "../../services/collections";
import type { Images } from "../Screenshots/decorators/UImages";
import classes from "./Collections.module.css";

export function collectionCoverSources(item: Pick<CollectionValues, "coverUrl" | "screenshotIds">, images: Images[]) {
  const urls = new Map(images.map((image) => [image.fileId, image.thumbnail || image.url]));
  return [...new Set([item.coverUrl, ...item.screenshotIds.map((id) => urls.get(id))]
    .filter((url): url is string => typeof url === "string" && /^https?:\/\//i.test(url)))];
}

function CoverImage({ sources }: { sources: string[] }) {
  const [index, setIndex] = useState(0);
  return (
    <img className={classes.coverImage} src={sources[index] || "/assets/hero.png"} alt=""
      loading="lazy" onError={() => { if (index < sources.length) setIndex(index + 1); }} />
  );
}

export function CollectionCover({ sources }: { sources: string[] }) {
  return <CoverImage key={JSON.stringify(sources)} sources={sources} />;
}
