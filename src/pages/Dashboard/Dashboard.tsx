import { useState } from "react";
import { Container, Skeleton } from "@mantine/core";
import {
  IconClipboard,
  IconScreenshot,
  IconLogout,
  IconFolder,
} from "@tabler/icons-react";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { ClipsTable, ScreenshotsTable } from "./components";
import { CollectionsPanel } from "./components/CollectionsPanel";
import { useAuth } from "../../context/AuthContext";
import classes from "./css/Dashboard.module.css";

const sections = [
  { id: "clips", label: "Clips", icon: IconClipboard },
  { id: "screenshots", label: "Screenshots", icon: IconScreenshot },
  { id: "collections", label: "Colecciones", icon: IconFolder },
];

export function Dashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("clips");
  const { loading: clipsLoading } = useGetClips();

  if (!user) return null;

  return (
    <div className={classes.page}>
      <Container size="xl" py="xl">
        <h1 className={classes.pageTitle}>Dashboard</h1>
        <p className={classes.pageSubtitle}>Administra el contenido del sitio</p>

        <div className={classes.layout}>
          {/* Sidebar */}
          <aside className={classes.sidebar}>
            <p className={classes.sidebarLabel}>Contenido</p>
            <div className={classes.sidebarLinks}>
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`${classes.sidebarLink} ${active === id ? classes.sidebarLinkActive : ""}`}
                  onClick={() => setActive(id)}
                  aria-current={active === id ? "page" : undefined}
                >
                  <Icon size={18} stroke={1.5} className={classes.sidebarIcon} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Perfil del Administrador */}
            <div className={classes.profileSection}>
              <div className={classes.profileInfo}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    className={classes.profileAvatar}
                  />
                ) : (
                  <div className={classes.profileAvatarFallback}>
                    {user.displayName?.charAt(0) || "A"}
                  </div>
                )}
                <div className={classes.profileMeta}>
                  <p className={classes.profileName}>
                    {user.displayName}
                  </p>
                  <span className={classes.profileRole}>
                    Administrador
                  </span>
                </div>
              </div>
              <button
                className={`${classes.authButtonSec} ${classes.logoutBtn}`}
                onClick={logout}
              >
                <IconLogout size={14} style={{ marginRight: "4px" }} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className={classes.content}>
            {active === "collections" ? <CollectionsPanel /> : clipsLoading ? (
              <div>
                <Skeleton height={40} radius="md" mb="md" />
                <Skeleton height={300} radius="md" />
              </div>
            ) : active === "clips" ? (
              <ClipsTable />
            ) : (
              <ScreenshotsTable />
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
