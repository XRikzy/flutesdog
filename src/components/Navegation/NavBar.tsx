import { Avatar, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useLayoutEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IconHome, IconVideo, IconPhoto, IconFolders, IconSettings, IconUser } from "@tabler/icons-react";
import { gsap } from "gsap";
import { useAuth } from "../../context/AuthContext";
import "./navbar.css";

const navItems = [
  { to: "/", label: "Inicio", icon: IconHome, end: true },
  { to: "/clips", label: "Clips", icon: IconVideo },
  { to: "/screenshots", label: "Capturas", icon: IconPhoto },
  { to: "/colecciones", label: "Colecciones", icon: IconFolders },
];
const dashboardItem = { to: "/dashboard", label: "Dashboard", icon: IconSettings, end: true };

export const NavBar = ({ opened, close, openAccount }: { opened: boolean; close?: () => void; openAccount: () => void }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { breakpoints } = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.md})`, undefined, { getInitialValueInEffect: false });
  const visible = isDesktop || opened;
  const { pathname } = useLocation();
  const { user, role, loading } = useAuth();
  const isAdmin = !loading && Boolean(user) && role === "admin";
  const name = user?.displayName || user?.email || "Mi cuenta";

  useLayoutEffect(() => {
    if (!visible || !sidebarRef.current) return;
    const media = gsap.matchMedia(sidebarRef.current);
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ defaults: { ease: "power2.out", clearProps: "transform,opacity" } })
        .from(".libraryLink", { x: -7, opacity: 0.42, duration: 0.24, stagger: 0.035 })
        .from(".libraryAccountLink", { y: 5, opacity: 0.55, duration: 0.24 }, 0.13);
    });
    return () => media.revert();
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible || !sidebarRef.current) return;
    const activeLink = sidebarRef.current.querySelector<HTMLElement>('.libraryLink[aria-current="page"]');
    if (!activeLink) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(activeLink, { "--library-indicator-scale": 0.24, duration: 0.24, ease: "power2.out" });
    });
    return () => media.revert();
  }, [pathname, visible, isAdmin]);

  return (
    <div className="librarySidebar" ref={sidebarRef}>
      <nav className="libraryNav" aria-label="Navegación principal">
        {(isAdmin ? [...navItems, dashboardItem] : navItems).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={close}
            className={({ isActive }) => isActive ? "libraryLink libraryLinkActive" : "libraryLink"}>
            <Icon size={18} stroke={1.65} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="libraryAccount">
        <button type="button" className="libraryAccountLink" aria-haspopup="dialog" onClick={() => {
          close?.();
          openAccount();
        }}>
          <Avatar src={user?.photoURL} alt="" size={30} radius="xl" aria-hidden="true">
            <IconUser size={18} stroke={1.65} />
          </Avatar>
          <span className="libraryAccountText">
            <span title={user ? name : undefined}>{user ? name : loading ? "Cuenta" : "Iniciar sesión"}</span>
            {user && <small>Cuenta de Google</small>}
          </span>
        </button>
      </div>
    </div>
  );
};
