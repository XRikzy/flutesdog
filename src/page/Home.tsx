import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Route, Routes } from "react-router-dom";
import { NavBar } from "../components/Navegation/NavBar";
import { Header } from "../components/Header/Header";
import { Awards, Clips, Dashboard, LadingPage } from "../components";
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
      padding="md"
      withBorder={false}
    >
      <AppShell.Header>
        <Header toggle={toggle} opened={opened} />
      </AppShell.Header>

      <AppShell.Navbar py="md" px={2}>
        <NavBar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<LadingPage />} />
          <Route path="clips" element={<Clips />} />
          <Route path="awards" element={<Awards />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};
