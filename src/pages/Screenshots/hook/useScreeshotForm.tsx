import { useForm } from "@mantine/form";
import { useState } from "react";

export const useScreenshotForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      file: file,
    },
    validate: {
      name: (value: string) =>
        value === "" ? "No haz agregado un nombre" : null,
      file: (value) => (value === null ? "No haz agregado el archivo" : null),
    },
  });
  return { form, setFile, file };
};
