import { useForm } from "@mantine/form";

export const useClipsForm = () => {

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      tag: [],
      embed: "",
    },
  });
  return { form };
};
