import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { AppRouter } from "./router/Router";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <AppRouter />
    </MantineProvider>
  );
}
