import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Router } from "./Router";
import "@mantine/core/styles.css";
export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Router />
    </MantineProvider>
  );
}
