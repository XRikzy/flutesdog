import { useEffect, useState } from "react";
import { Anchor, Container, Image, SimpleGrid, Skeleton, Stack, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconArrowRight, IconPlayerPlayFilled, IconPlus } from "@tabler/icons-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Hero } from "./Hero/Hero";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { ClipShareActions } from "../ClipShareActions";
import { ClipPlayback } from "../../pages/Clips/ClipPlayback";
import { getClipThumbnail } from "../../utils/clipThumbnail";
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

const sectionReveal = {
  initial: { opacity: 0.65, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
} as const;

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
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
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
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
  const reduceMotion = useReducedMotion();
  const { data: clips, loading } = useGetClips();
  const { data: collections } = useCollections();
  const featured = collections?.items.find((item) => item.id === collections.featuredId);
  const [recentImages, setRecentImages] = useState<Images[]>([]);
  const latestImage = recentImages[0];
  const [playingRecentId, setPlayingRecentId] = useState<string>();

  useEffect(() => {
    let active = true;
    getScreenshotImages().then((images) => {
      if (!active) return;
      const recent = images.filter((image) => image.url).sort(
        (a, b) => (Date.parse(String(b.createdAt)) || 0) - (Date.parse(String(a.createdAt)) || 0),
      );
      setRecentImages(recent);
    }).catch(() => { /* The screenshot service can be unavailable independently. */ });
    return () => { active = false; };
  }, []);

  const recentClips = [...clips]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return da !== db ? db - da : b.id.localeCompare(a.id);
    });
  const [latestClip, ...moreClips] = recentClips;

  return (
    <div className={classes.pageBackground}>
      <Container size={1194} className={classes.home}>
        <div className={classes.stage}>
          <Hero />
          <section className={classes.mediaWindow} aria-labelledby="latest-clip">
            <div className={classes.windowBar}>
              <Title order={2} id="latest-clip">Último clip subido</Title>
              <Anchor component={Link} to="/clips">Ver clips <IconArrowRight size={16} /></Anchor>
            </div>
            {loading ? <Skeleton className={classes.mediaSkeleton} radius="md" /> : latestClip ? (
              <div className={classes.latestClipWrapper}>
                <ClipPlayback title={latestClip.title} videoUrl={latestClip.videoUrl} embed={latestClip.embed} />
                <div className={classes.clipInfo}>
                  <h3 className={classes.clipTitle}>{latestClip.title}</h3>
                  <div className={classes.tagsRow}>
                    {latestClip.tag.map((tag, index) => <span key={index} className={classes.tag}>{tag}</span>)}
                  </div>
                  <ClipShareActions id={latestClip.id} />
                </div>
              </div>
            ) : <p className={classes.empty}>No hay clips aún.</p>}
          </section>
        </div>

        {moreClips.length > 0 && (
          <motion.section className={classes.chapter} aria-labelledby="recent-clips" {...(reduceMotion ? {} : sectionReveal)}>
            <div className={classes.sectionHeader}>
              <Title order={2} id="recent-clips" className={classes.sectionTitle}>Clips <span>recientes</span></Title>
              <Anchor component={Link} to="/clips">Ver biblioteca <IconArrowRight size={16} /></Anchor>
            </div>
            <SimpleGrid cols={{ base: 1, xs: 2, lg: 3 }} spacing="lg">
              {moreClips.slice(0, 3).map((clip) => {
                const title = clip.title || "Clip";
                const poster = getClipThumbnail(clip);
                return (
                  <article key={clip.id} className={classes.clipTile}>
                    {playingRecentId === clip.id || (!clip.videoUrl && !clip.embed) ? (
                      <ClipPlayback title={title} videoUrl={clip.videoUrl} embed={clip.embed} autoPlay showDownload={false} />
                    ) : (
                      <button type="button" className={classes.clipPreview} aria-label={`Reproducir ${title}`}
                        onClick={() => setPlayingRecentId(clip.id)}>
                        {poster && (
                          <img key={poster} src={poster} alt="" loading="lazy"
                            onError={(event) => { event.currentTarget.hidden = true; }} />
                        )}
                        <span className={classes.playControl}>
                          <IconPlayerPlayFilled aria-hidden="true" size={22} />
                        </span>
                        <span className={classes.playText}>Reproducir</span>
                      </button>
                    )}
                    <h3><Link to={`/clips/${encodeURIComponent(clip.id)}`}>{title}</Link></h3>
                    {clip.tag.length > 0 && <p>{clip.tag.slice(0, 3).join(" · ")}</p>}
                  </article>
                );
              })}
            </SimpleGrid>
          </motion.section>
        )}

        {(featured || latestImage?.url) && (
          <SimpleGrid cols={{ base: 1, lg: featured && latestImage?.url ? 2 : 1 }} spacing="lg" className={classes.chapter}>
            {featured && (
              <Stack component="section" className={classes.featurePanel} aria-label="Colección destacada">
                <Title order={2} className={classes.sectionTitle}>Colección <span>destacada</span></Title>
                <CollectionCard item={featured} images={recentImages} />
                <Anchor component={Link} to="/colecciones">Ver todas las colecciones</Anchor>
              </Stack>
            )}
            {latestImage?.url && (
              <Stack component="section" className={classes.capturePanel} aria-label="Última captura">
                <Title order={2} className={classes.sectionTitle}>Última <span>captura</span></Title>
                <a href={latestImage.url} target="_blank" rel="noreferrer">
                  <Image src={latestImage.thumbnail || latestImage.url} alt={latestImage.name} loading="lazy" radius="md" mah={360} fit="contain" />
                </a>
                <Anchor component={Link} to="/screenshots">Ver galería</Anchor>
              </Stack>
            )}
          </SimpleGrid>
        )}

        {/* FAQ */}
        <motion.section
          className={classes.faqSection}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          aria-label="Preguntas frecuentes"
        >
          <motion.div variants={fadeUp}>
            <Title order={2} className={classes.sectionTitle} mb="xl">
              Preguntas <span>frecuentes</span>
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
        <div className={classes.closing}>
          <footer className={classes.footer}>
            <Link to="/" className={classes.footerBrand}>Perro Flautas</Link>
            <nav aria-label="Biblioteca">
              <Link to="/clips">Clips</Link>
              <Link to="/screenshots">Capturas</Link>
              <Link to="/colecciones">Colecciones</Link>
            </nav>
          </footer>
        </div>
      </Container>
    </div>
  );
};
