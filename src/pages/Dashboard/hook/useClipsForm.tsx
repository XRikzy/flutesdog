import { useForm } from "@mantine/form";
import { regex } from "../../../utils/regex";



export const useClipsForm = () => {
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
