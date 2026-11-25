import { useState } from "react";
import { SimpleGrid } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import { ClipShareActions } from "../../components/ClipShareActions";
import type { Ivideos } from "../../constants/documents";
import { getClipThumbnail } from "../../utils/clipThumbnail";
import { ClipPlayback } from "./ClipPlayback";
import classes from "./Clips.module.css";
import library from "../../components/LibraryPage.module.css";

export function ClipsGrid({ clips }: { clips: Ivideos[] }) {
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {clips.map(({ id, title, embed, videoUrl, tag, thumbnailUrl }) => {
        const cover = getClipThumbnail({ thumbnailUrl, videoUrl, embed });
        return (
          <article key={id} className={library.card}>
            {activeClipId === id || (!videoUrl && !embed) ? (
              <ClipPlayback title={title} videoUrl={videoUrl} embed={embed} autoPlay />
            ) : (
              <button type="button" className={classes.playPreview} aria-label={`Reproducir ${title}`} onClick={() => setActiveClipId(id)}>
                {cover && <img
                  key={cover}
                  src={cover}
                  alt=""
                  loading="lazy"
                  className={classes.clipThumbnail}
                  onError={(event) => { event.currentTarget.hidden = true; }}
                />}
                <span className={classes.playLabel}><IconPlayerPlay size={26} aria-hidden="true" /> Reproducir</span>
              </button>
            )}

            {/* Info */}
            <div className={library.cardBody}>
              <p className={library.cardTitle}>{title}</p>
              {tag.length > 0 && (
                <div className={classes.tagsRow}>
                  {tag.map((name, index) => (
                    <span key={index} className={classes.tag}>
                      {name}
                    </span>
                  ))}
                </div>
              )}
              <ClipShareActions id={id} />
            </div>
          </article>
        );
      })}
    </SimpleGrid>
  );
}
