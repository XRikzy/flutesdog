import { useForm } from "@mantine/form";
import { EditVideos } from "../../../constants/documents";
import { regex } from "../../../utils/regex";

export const useClipsEditForm = (data: EditVideos | undefined) => {
  const editForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: data?.title || "",
      tag: data?.tag || ["Gracioso"],
      embed: data?.embed || "",
      videoUrl: data?.videoUrl || "",
    },
    validate: {
      title: (value: string) =>
        value.trim() === "" ? "Escribe un título primero" : null,
      embed: (value: string, values) => {
        // Solo validar embed si no hay videoUrl (es decir, es un clip de YouTube legacy)
        if (!values.videoUrl && (!value || !regex.test(value))) {
          return "No has agregado un URL embed de youtube válido";
        }
        return null;
      },
    },
  });
  return { editForm };
};
