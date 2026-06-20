import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "../components/Navegation/NavBar";
import { Header } from "../components/Header/Header";
import { Screenshots } from "./Screenshots";
import { LandingPage } from "../components";
import { Dashboard } from "./Dashboard";
import { Clips } from "./Clips";
import { PageTransition } from "../components/PageTransition";

export const Home = () => {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding={0}
      withBorder={false}
    >
      <AppShell.Header>
        <Header toggle={toggle} opened={opened} />
      </AppShell.Header>

      <AppShell.Navbar py="md" px="sm" style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--border)" }}>
        <NavBar close={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="clips" element={<Clips />} />
            <Route path="screenshots" element={<Screenshots />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Routes>
        </PageTransition>
      </AppShell.Main>
    </AppShell>
  );
};
