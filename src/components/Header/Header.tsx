import { Burger } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { IconBrandTiktok } from "@tabler/icons-react";
import { motion } from "framer-motion";
import classes from "./Header.module.css";

type HeaderProps = {
  opened: boolean;
  toggle: () => void;
};

const navItems = [
  { to: "/", label: "Inicio", end: true },
  { to: "/clips", label: "Clips" },
  { to: "/screenshots", label: "Screenshots" },
  { to: "/dashboard", label: "Dashboard" },
];

export const Header = ({ opened, toggle }: HeaderProps) => {
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        {/* Logo */}
        <NavLink to="/" className={classes.logo}>
          <span className={classes.logoDot} />
          <span className={classes.logoText}>Perro Flautas</span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className={classes.navLinks} aria-label="Navegación principal" style={{ display: "var(--nav-display, flex)" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? `${classes.navLink} ${classes.navLinkActive}`
                  : classes.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}

          <motion.a
            href="https://www.tiktok.com/@all4nb?_t=8kIM1a3KEEQ&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.socialIcon}
            aria-label="TikTok de Allan"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconBrandTiktok size={18} stroke={1.5} />
          </motion.a>
        </nav>

        {/* Mobile Burger */}
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
          className={classes.burger}
          aria-label="Abrir menú"
        />
      </div>
    </header>
  );
};
