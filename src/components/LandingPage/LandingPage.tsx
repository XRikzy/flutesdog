import { useEffect, useState } from "react";
import { Anchor, Container, Image, Skeleton, Stack, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "./Hero/Hero";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { ClipShareActions } from "../ClipShareActions";
import { VideoPlayer } from "../VideoPlayer/VideoPlayer";
import { useCollections } from "../../hooks/useCollections";
import { CollectionCard } from "../../pages/Collections/CollectionsPage";
import { getScreenshotImages } from "../../pages/Screenshots/service/screenshot.service";
import type { Images } from "../../pages/Screenshots/decorators/UImages";
import classes from "./LandingPage.module.css";

const faqs = [
  {
    q: "¿Qué encontraré aquí?",
    a: "Clips graciosos de nosotros jugando jueguitos y screenshots — imágenes épicas o graciosas a lo largo de nuestra amistad. Una biblioteca de momentos que no queremos olvidar.",
  },
  {
    q: "¿Puedo subir clips también?",
    a: "Lo siento pero no amigo, es una página donde simplemente se pueden subir clips de un solo canal de YouTube (o por los administradores).",
  },
  {
    q: "¿Puedo comunicarme con ustedes?",
    a: "Depende con quién. Si es con Allan, puedes hacerlo siguiendo su cuenta de TikTok. Si es con los demás integrantes, por ahora no.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={classes.faqItem}>
      <button
        className={classes.faqTrigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <IconPlus
          size={18}
          className={`${classes.faqIcon} ${open ? classes.faqIconOpen : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className={classes.faqAnswer}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const LandingPage = () => {
  const { data: clips, loading } = useGetClips();
  const { data: collections } = useCollections();
  const featured = collections?.items.find((item) => item.id === collections.featuredId);
  const [latestImage, setLatestImage] = useState<Images>();

  useEffect(() => {
    let active = true;
    getScreenshotImages().then((images) => {
      if (!active) return;
      const recent = images.filter((image) => image.url).sort(
        (a, b) => (Date.parse(String(b.createdAt)) || 0) - (Date.parse(String(a.createdAt)) || 0),
      );
      setLatestImage(recent[0]);
    }).catch(() => { /* The screenshot service can be unavailable independently. */ });
    return () => { active = false; };
  }, []);

  const latestClip = [...clips]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return da !== db ? db - da : b.id.localeCompare(a.id);
    })[0];

  return (
    <Container size="lg" py="xl">
      {/* HERO */}
      <Hero />

      {/* DIVIDER */}
      <div className={classes.divider} />

      {featured && (
        <Stack component="section" mb="xl" aria-label="Colección destacada">
          <Title order={2}>Colección destacada</Title>
          <CollectionCard item={featured} />
          <Anchor component={Link} to="/colecciones">Ver todas las colecciones</Anchor>
        </Stack>
      )}

      {/* ÚLTIMO CLIP SUBIDO */}
      <motion.section
        className={classes.latestSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        aria-label="Último clip subido"
      >
        <span className={classes.sectionEyebrow}>Novedad</span>
        <Title order={2} className={classes.sectionTitle}>
          Último clip subido
        </Title>

        {loading ? (
          <div className={classes.skeletonWrapper}>
            <Skeleton height={460} radius="md" />
          </div>
        ) : latestClip ? (
          <div className={classes.latestClipWrapper}>
            {latestClip.videoUrl ? (
              /* Archivo de video — con descarga */
              <VideoPlayer
                src={latestClip.videoUrl}
                title={latestClip.title}
                showDownload
              />
            ) : (
              /* Clip legacy de YouTube — iframe embed */
              <div className={classes.iframeWrapper}>
                <iframe
                  src={latestClip.embed}
                  title={latestClip.title}
                  className={classes.videoIframe}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            <div className={classes.clipInfo}>
              <p className={classes.clipTitle}>{latestClip.title}</p>
              <div className={classes.tagsRow}>
                {latestClip.tag.map((t, i) => (
                  <span key={i} className={classes.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <ClipShareActions id={latestClip.id} />
            </div>
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No hay clips aún.
          </p>
        )}
      </motion.section>

      {latestImage?.url && (
        <Stack component="section" mt="xl" aria-label="Última captura">
          <Title order={2}>Última captura</Title>
          <a href={latestImage.url} target="_blank" rel="noreferrer">
            <Image src={latestImage.thumbnail || latestImage.url} alt={latestImage.name} loading="lazy" radius="md" mah={420} fit="contain" />
          </a>
          <Anchor component={Link} to="/screenshots">Ver galería</Anchor>
        </Stack>
      )}

      {/* DIVIDER */}
      <div className={classes.divider} />

      {/* FAQ */}
      <motion.section
        className={classes.faqSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        aria-label="Preguntas frecuentes"
      >
        <motion.span className={classes.sectionEyebrow} variants={fadeUp}>
          Preguntas frecuentes
        </motion.span>
        <motion.div variants={fadeUp}>
          <Title order={2} className={classes.sectionTitle} mb="xl">
            ¿Tienes dudas?
          </Title>
        </motion.div>
        <motion.div variants={stagger} style={{ maxWidth: 660, margin: "0 auto" }}>
          {faqs.map((faq) => (
            <motion.div key={faq.q} variants={fadeUp}>
              <FaqItem q={faq.q} a={faq.a} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </Container>
  );
};
