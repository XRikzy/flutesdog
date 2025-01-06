import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Route, Routes } from "react-router-dom";
import { NavBar } from "../components/Navegation/NavBar";
import { Header } from "../components/Header/Header";
import { Screenshots } from "./Screenshots";
import { LandingPage } from "../components";
import { Dashboard } from "./Dashboard";
import { Clips } from "./Clips";
export const Home = () => {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="sm"
      withBorder={false}
    >
      <AppShell.Header>
        <Header toggle={toggle} opened={opened} />
      </AppShell.Header>

      <AppShell.Navbar py="md" px={1}>
        <NavBar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="clips" element={<Clips />} />
          <Route path="screenshots" element={<Screenshots />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};
