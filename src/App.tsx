import { MantineProvider } from "@mantine/core";
import { MotionConfig } from "motion/react";
import { theme } from "./theme";
import { AppRouter } from "./router/Router";
import { AuthProvider } from "./context/AuthContext";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import "./styles/global.css";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <AppRouter />
        </MotionConfig>
      </AuthProvider>
    </MantineProvider>
  );
}
