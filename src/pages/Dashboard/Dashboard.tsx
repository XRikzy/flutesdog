import { useState } from "react";
import { Container, Skeleton, Center, Loader } from "@mantine/core";
import {
  IconClipboard,
  IconScreenshot,
  IconLock,
  IconBrandGoogle,
  IconAlertTriangle,
  IconLogout,
} from "@tabler/icons-react";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { ClipsTable, ScreenshotsTable } from "./components";
import { useAuth } from "../../context/AuthContext";
import { notifications } from "@mantine/notifications";
import classes from "./css/Dashboard.module.css";

const sections = [
  { id: "clips", label: "Clips", icon: IconClipboard },
  { id: "screenshots", label: "Screenshots", icon: IconScreenshot },
];

export function Dashboard() {
  const { user, role, loading: authLoading, signInWithGoogle, logout } = useAuth();
  const [active, setActive] = useState("clips");
  const { loading: clipsLoading } = useGetClips();
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Error signing in:", err);
      notifications.show({
        title: "Error al iniciar sesión",
        message: err.message || "No se pudo conectar con Firebase Auth. Verifica la consola o las configuraciones de Firebase.",
        color: "red",
        autoClose: 10000,
      });
    } finally {
      setSigningIn(false);
    }
  };

  // 1. Cargando autenticación
  if (authLoading) {
    return (
      <div className={classes.page}>
        <Center style={{ height: "70vh" }}>
          <Loader size="xl" color="var(--accent)" />
        </Center>
      </div>
    );
  }

  // 2. No está autenticado -> Mostrar pantalla de Login
  if (!user) {
    return (
      <div className={classes.page}>
        <div className={classes.authContainer}>
          <div className={classes.authCard}>
            <IconLock size={44} stroke={1.5} color="var(--accent)" />
            <h2 className={classes.authTitle}>Administración</h2>
            <p className={classes.authText}>
              Inicia sesión con tu cuenta de Google para acceder a las opciones de administración de clips y screenshots de Perro Flautas.
            </p>
            <button
              className={classes.authButton}
              onClick={handleSignIn}
              disabled={signingIn}
            >
              {signingIn ? (
                <Loader size="xs" color="#fff" />
              ) : (
                <IconBrandGoogle size={18} />
              )}
              <span>{signingIn ? "Conectando..." : "Iniciar sesión con Google"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Autenticado pero no es administrador -> Acceso Denegado
  if (role !== "admin") {
    return (
      <div className={classes.page}>
        <div className={classes.authContainer}>
          <div className={classes.authCard}>
            <IconAlertTriangle size={44} stroke={1.5} color="#ff4a4a" />
            <h2 className={classes.authTitle}>Acceso Denegado</h2>
            <p className={classes.authText}>
              La cuenta <strong>{user.email}</strong> está registrada como un usuario normal.
              Solo los administradores autorizados pueden agregar, editar o eliminar contenido del sitio.
            </p>
            <button className={classes.authButtonSec} onClick={logout}>
              <IconLogout size={16} style={{ marginRight: "6px" }} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Autenticado y es administrador -> Mostrar Dashboard Normal
  return (
    <div className={classes.page}>
      <Container size="xl" py="xl">
        <h1 className={classes.pageTitle}>Dashboard</h1>
        <p className={classes.pageSubtitle}>Administra el contenido del sitio</p>

        <div className={classes.layout}>
          {/* Sidebar */}
          <aside className={classes.sidebar}>
            <p className={classes.sidebarLabel}>Contenido</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border)" }}
                  />
                ) : (
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: "0.8rem", fontWeight: "bold" }}>
                    {user.displayName?.charAt(0) || "A"}
                  </div>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.displayName}
                  </p>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase" }}>
                    Administrador
                  </span>
                </div>
              </div>
              <button
                className={classes.authButtonSec}
                onClick={logout}
                style={{ height: "32px", fontSize: "0.78rem", marginTop: 0 }}
              >
                <IconLogout size={14} style={{ marginRight: "4px" }} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className={classes.content}>
            {clipsLoading ? (
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
