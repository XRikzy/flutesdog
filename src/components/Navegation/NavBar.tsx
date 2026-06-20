import { NavLink } from "react-router-dom";
import "./navbar.css";

const navItems = [
  { to: "/", label: "Inicio", end: true },
  { to: "/clips", label: "Clips" },
  { to: "/screenshots", label: "Screenshots" },
  { to: "/dashboard", label: "Dashboard" },
];

interface NavBarProps {
  close?: () => void;
}

export const NavBar = ({ close }: NavBarProps) => {
  return (
    <nav className="mobileNav" aria-label="Menú móvil">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? "mobileLink mobileLinkActive" : "mobileLink"
          }
          onClick={close}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
