import { NavLink } from "react-router-dom";
import "./navbar.css";

const navItems = [
  { to: "/", label: "Inicio", end: true },
  { to: "/clips", label: "Clips" },
  { to: "/screenshots", label: "Screenshots" },
  { to: "/dashboard", label: "Dashboard" },
];

export const NavBar = () => {
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
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
