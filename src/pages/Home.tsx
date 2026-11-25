import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NavBar } from "../components/Navegation/NavBar";
import { Header } from "../components/Header/Header";
import { PageTransition } from "../components/PageTransition";
import { Login } from "./Login";

export const Home = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const [accountOpen, { open: openAccount, close: closeAccount }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const accountIntent = params.get("cuenta");

  const dismissAccount = () => {
    closeAccount();
    if (!accountIntent) return;
    params.delete("cuenta");
    const search = params.toString();
    navigate({ pathname: location.pathname, search: search ? `?${search}` : "", hash: location.hash }, { replace: true });
  };

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
        <NavBar opened={opened} close={close} openAccount={openAccount} />
      </AppShell.Navbar>

      <AppShell.Main>
        <PageTransition>
          <Outlet context={{ openAccount }} />
        </PageTransition>
      </AppShell.Main>
      <Login opened={accountOpen || accountIntent === "1" || accountIntent === "admin"}
        fromDashboard={accountIntent === "admin"} onClose={dismissAccount} />
    </AppShell>
  );
};
