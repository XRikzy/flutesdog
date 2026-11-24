import { VideoPlayer } from "../../components/VideoPlayer/VideoPlayer";
import type { Ivideos } from "../../constants/documents";
import classes from "./Clips.module.css";

export function ClipPlayback({ title, videoUrl, embed, autoPlay = false }: Pick<Ivideos, "title" | "videoUrl" | "embed"> & { autoPlay?: boolean }) {
  if (videoUrl) return <VideoPlayer key={videoUrl} src={videoUrl} title={title} showDownload autoPlay={autoPlay} />;
  if (!embed) return <p className={classes.cardBody}>El video de este clip no está disponible.</p>;
  const src = autoPlay && /^https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\//.test(embed)
    ? `${embed.split("#")[0]}${embed.includes("?") ? "&" : "?"}autoplay=1`
    : embed;

  return (
    <div className={classes.iframeWrapper}>
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={classes.iframe}
        loading="lazy"
      />
    </div>
  );
}
