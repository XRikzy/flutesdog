import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/Navegation/NavBar";
import { Header } from "../components/Header/Header";
import { PageTransition } from "../components/PageTransition";

export const Home = () => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 78 }}
      navbar={{
        width: { base: 224, md: 168, xl: 184 },
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      padding={0}
      withBorder={false}
    >
      <AppShell.Header>
        <Header toggle={toggle} opened={opened} />
      </AppShell.Header>

      <AppShell.Navbar id="library-sidebar" className="libraryPanel" py="sm" px="sm">
        <NavBar opened={opened} close={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </AppShell.Main>
    </AppShell>
  );
};
