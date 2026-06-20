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
    fontFamily: "'Outfit', sans-serif",
    fontWeight: "800",
  },
  black: "#0a0a0f",
  white: "#f0f0ff",
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
          backgroundColor: "#111118",
          border: "1px solid rgba(255,255,255,0.06)",
        },
        header: {
          backgroundColor: "#111118",
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
          backgroundColor: "#1a1a26",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#f0f0ff",
          "&:focus": {
            borderColor: "rgba(0, 85, 255, 0.5)",
          },
        },
      },
    },
    TagsInput: {
      styles: {
        input: {
          backgroundColor: "#1a1a26",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#f0f0ff",
        },
      },
    },
  },
});
