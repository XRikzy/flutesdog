import { useForm } from "@mantine/form";

export const useClipsForm = () => {
  const regex: RegExp =
    /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}$/;
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      tag: ["Gracioso"],
      embed: "",
    },
    validate: {
      embed: (value) =>
        regex.test(value) ? null : "Tiene que ser un URL de youtube",
    },
  });
  return { form };
};
