import { useState, type FormEvent } from "react";
import { Box } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconBrandTiktok, IconSearch } from "@tabler/icons-react";
import classes from "./Header.module.css";

export const Header = ({ opened, toggle }: { opened: boolean; toggle: () => void }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/clips?${new URLSearchParams({ q: value })}` : "/clips");
  };

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <div className={classes.brand}>
          <Box component="button" type="button" className={classes.menuToggle} hiddenFrom="md"
            onClick={toggle} aria-label={opened ? "Cerrar menú" : "Abrir menú"}
            aria-controls="library-sidebar" aria-expanded={opened}>
            <span aria-hidden="true"><i /><i /></span>
          </Box>
          <Link to="/" className={classes.logo} aria-label="Perro Flautas">
            <img src="/dog.svg" alt="" width={28} height={28} />
            <span>Perro Flautas</span>
          </Link>
        </div>
        <form className={classes.search} role="search" aria-label="Buscar en la biblioteca" onSubmit={search}>
          <input type="search" aria-label="Buscar en la biblioteca" placeholder="Buscar clips" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button type="submit" aria-label="Buscar"><IconSearch size={19} /></button>
        </form>
        <a href="https://www.tiktok.com/@all4nb?_t=8kIM1a3KEEQ&_r=1" target="_blank" rel="noopener noreferrer"
          className={classes.social} aria-label="TikTok de Allan"><IconBrandTiktok size={19} /></a>
      </div>
    </header>
  );
};
