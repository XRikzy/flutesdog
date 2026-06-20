import { useCallback, useRef, useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import { Container, SimpleGrid, Skeleton } from "@mantine/core";
import {
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconPhoto,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { notifications } from "@mantine/notifications";
import { useAddScreenshot } from "./hook/useAddScreenshot";
import classes from "./Screenshots.module.css";

export const Screenshots = () => {
  const { authenticator, images, loading, publicKey, urlEndpoint, fetchImages } =
    useAddScreenshot();
  const IKUploadRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));

  const handleOnSuccess = useCallback(() => {
    fetchImages();
    notifications.show({ title: "¡Agregado!", message: "Screenshot subida correctamente." });
    setProgress(0);
    setTimeout(() => window.location.reload(), 1000);
  }, [fetchImages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeLightbox();
    },
    [lightboxIndex]
  );

  return (
    <div className={classes.page} onKeyDown={handleKeyDown} tabIndex={-1}>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        <IKUpload
          ref={IKUploadRef}
          urlEndpoint={urlEndpoint}
          fileName={file?.name}
          folder="Flutesdog"
          onUploadProgress={(p) =>
            setProgress(Math.round((p.loaded / p.total) * 100))
          }
          onSuccess={handleOnSuccess}
          onError={() =>
            notifications.show({
              title: "Oops",
              message: "No pudimos subir la imagen.",
              color: "red",
            })
          }
          hidden
          accept="image/png,image/jpeg"
        />

        {/* Header */}
        <div className={classes.topBar}>
          <Container size="xl">
            <div className={classes.topBarInner}>
              <div>
                <h1 className={classes.pageTitle}>Screenshots</h1>
                <p className={classes.pageSubtitle}>
                  {images.length} imagen{images.length !== 1 ? "es" : ""} guardada{images.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className={classes.controls}>
                {/* Disclaimer */}
                <span className={classes.disclaimer}>
                  ⚠️ Por favor no suban nada cuestionable
                </span>
                {/* Upload button */}
                <motion.label
                  className={classes.uploadButton}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Subir nueva screenshot"
                  id="screenshots-upload-btn"
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setFile(f);
                      if (f) IKUploadRef.current?.click();
                    }}
                  />
                  <IconPlus size={16} />
                  <span>Nueva Screenshot</span>
                </motion.label>
              </div>
            </div>

            {/* Upload progress */}
            <AnimatePresence>
              {progress > 0 && (
                <motion.div
                  className={classes.progressWrapper}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className={classes.progressBar}>
                    <motion.div
                      className={classes.progressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className={classes.progressLabel}>{progress}%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        </div>

        {/* Grid */}
        <Container size="xl" py="xl">
          {loading ? (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height={260} radius="md" />
              ))}
            </SimpleGrid>
          ) : images.length === 0 ? (
            <motion.div
              className={classes.emptyState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <IconPhoto size={52} stroke={1} color="var(--text-muted)" />
              <p className={classes.emptyTitle}>Sin screenshots aún</p>
              <p className={classes.emptySubtitle}>
                Sube la primera imagen con el botón de arriba.
              </p>
            </motion.div>
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
                    className={classes.imageCard}
                    onClick={() => openLightbox(index)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={`Ver screenshot: ${name}`}
                  >
                    <img
                      src={url}
                      alt={name}
                      className={classes.image}
                      loading="lazy"
                    />
                    <div className={classes.imageOverlay}>
                      <span className={classes.imageName}>{name}</span>
                    </div>
                  </motion.button>
                ))}
              </SimpleGrid>
            </motion.div>
          )}
        </Container>
      </IKContext>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
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
