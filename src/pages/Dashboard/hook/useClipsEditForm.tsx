import { useForm } from "@mantine/form";
import { EditVideos } from "../../../constants/documents";
import { regex } from "../../../utils/regex";

export const useClipsEditForm = (data: EditVideos | undefined) => {
  
  if (!data) {
    throw new Error("Los datos para editar el clip no están disponibles.");
  }
  const editForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: data.title || "",
      tag: data.tag || ["Gracioso"],
      embed: data.embed || "",
    },
    validate: {
      embed: (value: string) =>
        regex.test(value) ? null : "No haz agregado un URL embed de youtube",
      title: (value: string) =>
        value === "" ? "Escribe un titulo primero" : null,
    },
  });
  return { editForm };
};
