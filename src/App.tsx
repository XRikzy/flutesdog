import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Router } from "./Router";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <Router />
      </ModalsProvider>
    </MantineProvider>
  );
}
