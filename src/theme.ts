import { createTheme, MantineColorsTuple } from "@mantine/core";

const blue: MantineColorsTuple = [
  "#e8eeff",
  "#ccdaff",
  "#99b5ff",
  "#638eff",
  "#3669ff",
  "#1a52ff",
  "#0044ff",
  "#0037e6",
  "#002fcd",
  "#0026b4",
];

export const theme = createTheme({
  primaryColor: "blue",
  colors: { blue },
  defaultRadius: "md",
  fontFamily: "'Inter', sans-serif",
  fontFamilyMonospace: "Menlo, Monaco, Consolas, monospace",
  headings: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: "500",
  },
  black: "#0a0c11",
  white: "#eef1ea",
  components: {
    Button: {
      defaultProps: { radius: "md" },
    },
    Badge: {
      defaultProps: { radius: "sm" },
    },
    Card: {
      defaultProps: { radius: "md" },
    },
    Modal: {
      styles: {
        content: {
          backgroundColor: "var(--bg-surface)",
          border: "1px solid rgba(255,255,255,0.06)",
        },
        header: {
          backgroundColor: "var(--bg-surface)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        },
        overlay: {
          backdropFilter: "blur(6px)",
        },
      },
    },
    TextInput: {
      styles: {
        input: {
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#eef1ea",
          "&:focus": {
            borderColor: "var(--border-hover)",
          },
        },
      },
    },
    TagsInput: {
      styles: {
        input: {
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#eef1ea",
        },
      },
    },
  },
});
