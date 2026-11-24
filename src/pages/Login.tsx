import { useEffect, useRef, useState } from "react";
import { Alert, Avatar, Button, Modal, Stack, Text } from "@mantine/core";
import { IconBrandGoogle, IconLogout, IconUser } from "@tabler/icons-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import classes from "./Login.module.css";

interface LoginProps {
  opened: boolean;
  fromDashboard: boolean;
  onClose: () => void;
}

export function Login({ opened, fromDashboard, onClose }: LoginProps) {
  const { user, role, loading, signInWithGoogle, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [startedLogin, setStartedLogin] = useState(false);
  const attempt = useRef(0);

  const close = () => {
    attempt.current++;
    setStartedLogin(false);
    setBusy(false);
    setError("");
    onClose();
  };

  useEffect(() => {
    if (opened && !fromDashboard && startedLogin && user && !loading) {
      setStartedLogin(false);
      onClose();
    }
  }, [opened, fromDashboard, startedLogin, user, loading, onClose]);

  const handleAccount = async () => {
    const current = ++attempt.current;
    setBusy(true);
    setError("");
    setStartedLogin(!user);
    try {
      if (user) await logout();
      else await signInWithGoogle();
    } catch {
      if (current === attempt.current) {
        setStartedLogin(false);
        setError(user ? "No pudimos cerrar la sesión. Intenta de nuevo." : "No pudimos iniciar sesión con Google. Intenta de nuevo.");
      }
    } finally {
      if (current === attempt.current) setBusy(false);
    }
  };

  if (opened && fromDashboard && user && !loading) {
    return <Navigate to={role === "admin" ? "/dashboard" : "/"} replace />;
  }

  return (
    <Modal opened={opened} onClose={close} centered size={420} radius={22}
      title={user ? "Mi cuenta" : "Iniciar sesión"}
      closeButtonProps={{ "aria-label": "Cerrar inicio de sesión" }}
      overlayProps={{ backgroundOpacity: 0.68, blur: 5 }}
      styles={{ header: { backgroundColor: "transparent", borderBottom: 0 } }}
      classNames={{ content: classes.dialog, header: classes.header, title: classes.title, body: classes.body, close: classes.close }}>
      <Stack gap="lg">
        <div className={classes.intro}>
          <Avatar className={classes.avatar} src={user?.photoURL} alt="" size={52} radius={16} aria-hidden="true">
            <IconUser size={24} stroke={1.65} />
          </Avatar>
          <Text size="sm" c="dimmed">
            {user ? user.displayName || user.email || "Cuenta de Google" : "Entra con Google para compartir capturas con la comunidad."}
          </Text>
        </div>
        {error && <Alert role="alert" color="red">{error}</Alert>}
        <Button loading={busy || loading} onClick={handleAccount} className={classes.action}
          leftSection={user ? <IconLogout size={18} /> : <IconBrandGoogle size={18} />}>
          {user ? "Cerrar sesión" : "Iniciar sesión con Google"}
        </Button>
      </Stack>
    </Modal>
  );
}
