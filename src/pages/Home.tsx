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
          <Outlet />
        </PageTransition>
      </AppShell.Main>
    </AppShell>
  );
};
