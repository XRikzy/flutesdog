import { NavLink } from "react-router-dom";
import "./navbar.css";
export const NavBar = () => {
  return (
    <>
      {" "}
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "navlink navlink-active" : "navlink"
        }
      >
        Inicio
      </NavLink>
      <NavLink
        to="clips"
        className={({ isActive }) =>
          isActive ? "navlink navlink-active" : "navlink"
        }
      >
        Clips
      </NavLink>
      <NavLink
        to="awards"
        className={({ isActive }) =>
          isActive ? "navlink navlink-active" : "navlink"
        }
      >
        Awards
      </NavLink>
      <NavLink
        to="dashboard"
        className={({ isActive }) =>
          isActive ? "navlink navlink-active" : "navlink"
        }
      >
        Dashboard
      </NavLink>
    </>
  );
};
