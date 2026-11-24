import { Button } from "@mantine/core";
import { useLayoutEffect, useRef } from "react";
import { IconPlayerPlay } from "@tabler/icons-react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import classes from "./HeroImageRight.module.css";

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;
    const media = gsap.matchMedia(heroRef.current);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ defaults: { ease: "power3.out", clearProps: "transform,opacity" } })
        .from("[data-hero-line]", {
          yPercent: 110, opacity: 0.45, duration: 0.62, stagger: 0.12,
        }, 0)
        .from("[data-hero-copy]", { y: 12, opacity: 0, duration: 0.45 }, 0.32)
        .from("[data-hero-action]", { y: 6, opacity: 0.5, duration: 0.36 }, 0.42)
        .from("[data-hero-glow]", { scale: 0.72, opacity: 0, duration: 0.95 }, 0.04);
    });
    return () => media.revert();
  }, []);

  return (
    <section className={classes.hero} ref={heroRef} aria-label="Bienvenida">
      <div className={classes.glow} data-hero-glow aria-hidden="true" />
      <h1>
        <span className={classes.titleMask}><span data-hero-line>Clips y capturas</span></span>{" "}
        <span className={classes.titleMask}><span data-hero-line>de <span className={classes.accent}>Perro Flautas</span></span></span>
      </h1>
      <p data-hero-copy>Revive nuestras partidas y explora la biblioteca por juego, evento o momento.</p>
      <Button component={Link} to="/clips" className={classes.primary} id="hero-cta-clips" data-hero-action
        leftSection={<IconPlayerPlay size={19} />}>
        Explorar clips
      </Button>
    </section>
  );
};
