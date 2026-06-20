import { Button, Image } from "@mantine/core";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useGetClips } from "../../../hooks/Clips/useGetClips";
import classes from "./HeroImageRight.module.css";

export const Hero = () => {
  const { data: clips } = useGetClips();
  const clipCount = clips.length;

  const fadeUp = (delay: number) => ({
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const, delay },
    },
  });

  return (
    <section className={classes.hero} aria-label="Bienvenida">
      <div className={classes.heroGlow} aria-hidden="true" />
      <div className={classes.scanlines} aria-hidden="true" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "3rem",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {/* Contenido izquierda */}
        <div className={classes.heroContent}>
          <motion.span
            className={classes.eyebrow}
            initial="hidden"
            animate="visible"
            variants={fadeUp(0)}
          >
            Familia de aquellas
          </motion.span>

          <motion.h1
            className={classes.heroTitle}
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.1)}
          >
            Bienvenido a
            <span className={classes.heroAccent}>Perro Flautas</span>
          </motion.h1>

          <motion.p
            className={classes.heroSubtitle}
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.2)}
          >
            La biblioteca donde guardamos los mejores clips y capturas. Mas que amigos, hermanos.
          </motion.p>

          {/* Stats en vivo */}
          <motion.div
            className={classes.statsRow}
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.3)}
          >
            <div className={classes.stat}>
              <span className={classes.statValue}>
                {clipCount > 0 ? clipCount : "—"}
              </span>
              <span className={classes.statLabel}>Clips</span>
            </div>
            <div className={classes.stat}>
              <span className={classes.statValue}>∞</span>
              <span className={classes.statLabel}>Momentos</span>
            </div>
            <div className={classes.stat}>
              <span className={classes.statValue}>1</span>
              <span className={classes.statLabel}>José</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className={classes.ctaGroup}
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.4)}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                component={Link}
                to="/clips"
                className={classes.ctaPrimary}
                size="md"
                id="hero-cta-clips"
              >
                Ver clips
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                component={Link}
                to="/screenshots"
                className={classes.ctaSecondary}
                size="md"
                id="hero-cta-screenshots"
              >
                Screenshots
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Imagen */}
        <motion.div
          className={classes.heroImage}
          initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div
            className={classes.imageFrame}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/assets/hero.png"
              alt="Perro Flautas — imagen de bienvenida"
              className={classes.image}
              radius="xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
