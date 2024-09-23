import { useForm } from "@mantine/form";

export const useClipsForm = () => {
  const regex: RegExp =
    /^https?:\/\/(www\.)?youtube\.com\/embed\//;
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      tag: ["Gracioso"],
      embed: "",
    },
    validate: {
      embed: (value: string) =>
        regex.test(value) ? null : "No haz agregado un URL embed de youtube",
      title: (value: string) =>
        value === "" ? "Escribe un titulo primero" : null,
    },
  });
  return { form };
};
