import { useState } from "react";
import { IconDownload } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { IMAGEKIT_ENDPOINT, withImageKitTransform } from "../../utils/imageKit";
import classes from "./VideoPlayer.module.css";

/**
 * Descarga un video desde una URL cross-origin como blob para evitar
 * que el navegador abra una nueva pestaña en vez de descargarlo.
 */
async function downloadBlob(
  url: string,
  filename: string,
  onProgress?: (pct: number) => void
) {
  const response = await fetch(url);
  if (!response.ok || !response.body) throw new Error("Error al descargar el video");

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total > 0 && onProgress) onProgress(Math.round((received / total) * 100));
  }

  const blob = new Blob(chunks, { type: response.headers.get("content-type") || "application/octet-stream" });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(objectUrl);
}

type VideoPlayerProps = {
  /** URL del video original */
  src: string;
  /** Título del clip (usado como nombre de archivo al descargar) */
  title: string;
  /** Si se muestran los botones de descarga */
  showDownload?: boolean;
  autoPlay?: boolean;
};

export const VideoPlayer = ({ src, title, showDownload = true, autoPlay = false }: VideoPlayerProps) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [downloading, setDownloading] = useState<"compressed" | "original" | null>(null);
  const [dlProgress, setDlProgress] = useState(0);

  // URLs con transformaciones de ImageKit
  const canCompress = src.startsWith(IMAGEKIT_ENDPOINT);
  const playbackUrl = withImageKitTransform(src, "q-80,f-mp4");
  const compressedDlUrl = withImageKitTransform(src, "q-60,f-mp4");
  const extension = src.split(/[?#]/, 1)[0].match(/\.(mp4|webm|mov)$/i)?.[1] ?? "mp4";
  const safeName = title.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();

  const handleDownload = async (type: "compressed" | "original") => {
    if (downloading) return;
    setDownloading(type);
    setDlProgress(0);
    try {
      const url = type === "compressed" ? compressedDlUrl : src;
      const filename = type === "compressed" ? `${safeName}_comprimido.mp4` : `${safeName}.${extension}`;
      await downloadBlob(url, filename, (pct) => setDlProgress(pct));
    } catch (err) {
      console.error("Error al descargar:", err);
    } finally {
      setDownloading(null);
      setDlProgress(0);
    }
  };

  return (
    <div>
      <div className={classes.wrapper}>
        {/* Spinner mientras carga */}
        <AnimatePresence>
          {!videoLoaded && !videoError && (
            <motion.div
              className={classes.loadingOverlay}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={classes.spinner} />
            </motion.div>
          )}
        </AnimatePresence>

        <video
          className={classes.video}
          src={playbackUrl}
          controls
          autoPlay={autoPlay}
          preload="metadata"
          onError={() => setVideoError(true)}
          onLoadedMetadata={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
          onPlay={() => setVideoLoaded(true)}
          playsInline
        />
      </div>
      {videoError && (
        <p role="status">
          No pudimos reproducir este video. {showDownload && "Puedes intentar descargar el original."}
        </p>
      )}

      {/* Botones de descarga */}
      {showDownload && src && (
        <div className={classes.actions}>
          <span className={classes.actionsLabel}>Descargar</span>

          {canCompress && (
            <motion.button
              className={`${classes.downloadBtn} ${classes.downloadBtnPrimary}`}
              onClick={() => handleDownload("compressed")}
              disabled={downloading !== null}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              title="~50% más liviano, buena calidad"
            >
              <IconDownload size={13} />
              {downloading === "compressed"
                ? `Descargando ${dlProgress}%`
                : "Comprimido (recomendado)"}
            </motion.button>
          )}

          {/* Descarga original */}
          <motion.button
            className={classes.downloadBtn}
            onClick={() => handleDownload("original")}
            disabled={downloading !== null}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            title="Calidad original sin modificar"
          >
            <IconDownload size={13} />
            {downloading === "original"
              ? `Descargando ${dlProgress}%`
              : "Original"}
          </motion.button>
        </div>
      )}
    </div>
  );
};
