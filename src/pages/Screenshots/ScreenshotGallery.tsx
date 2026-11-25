import { useState } from "react";
import { SimpleGrid, Skeleton } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconPhoto, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import type { Images } from "./decorators/UImages";
import { LibraryEmpty } from "../../components/LibraryPage";
import library from "../../components/LibraryPage.module.css";
import classes from "./Screenshots.module.css";

export function ScreenshotGallery({
  images, loading, emptyTitle = "Aún no hay capturas",
  emptyMessage = "Ninguna captura coincide con la búsqueda o los filtros.",
}: { images: Images[]; loading: boolean; emptyTitle?: string; emptyMessage?: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={260} radius="md" />
          ))}
        </SimpleGrid>
      ) : images.length === 0 ? (
        <LibraryEmpty icon={<IconPhoto size={24} stroke={1.6} />} title={emptyTitle} description={emptyMessage} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.06 }}
        >
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {images.map(({ fileId, url, name }, index) => (
              <motion.button
                key={fileId}
                className={`${library.card} ${classes.imageCard}`}
                onClick={() => openLightbox(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                aria-label={`Ver screenshot: ${name}`}
              >
                <img
                  src={url}
                  alt=""
                  className={classes.image}
                  loading="lazy"
                />
                <div className={library.cardBody}>
                  <span className={library.cardTitle}>{name}</span>
                </div>
              </motion.button>
            ))}
          </SimpleGrid>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && images[lightboxIndex] && (
          <motion.div
            className={classes.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Vista de imagen"
          >
            {/* Close */}
            <button
              className={classes.lightboxClose}
              onClick={closeLightbox}
              aria-label="Cerrar"
              autoFocus
            >
              <IconX size={22} />
            </button>

            {/* Counter */}
            <span className={classes.lightboxCounter}>
              {lightboxIndex + 1} / {images.length}
            </span>

            {/* Prev */}
            <motion.button
              className={`${classes.lightboxNav} ${classes.lightboxPrev}`}
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              whileHover={{ scale: 1.1 }}
              aria-label="Imagen anterior"
            >
              <IconChevronLeft size={28} />
            </motion.button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxIndex}
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].name}
                className={classes.lightboxImage}
                initial={{ opacity: 0, scale: 0.95, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -40 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Next */}
            <motion.button
              className={`${classes.lightboxNav} ${classes.lightboxNext}`}
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              whileHover={{ scale: 1.1 }}
              aria-label="Siguiente imagen"
            >
              <IconChevronRight size={28} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
