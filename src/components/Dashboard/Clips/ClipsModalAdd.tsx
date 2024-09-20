import { Button, Group, Modal, TagsInput, TextInput } from "@mantine/core";

import { useClipsForm } from "./hook/useClipsForm";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../webservice/firebase";

type Props = {
  opened: boolean;
  close: () => void;
};
type Values = {
  title: string;
  embed: string;
  tag: never[];
};
export const ClipsModalAdd = ({ opened, close }: Props) => {
  const { form } = useClipsForm();
  const handleModalsCancel = () => {
    close();
    form.reset();
  };
  const handleSave = async ({ title, embed, tag }: Values) => {
    try {
      await addDoc(collection(db, "Clips"), {
        title,
        embed,
        tag,
      });
      console.log ("El clip ha sido agregado correctamente!!");
    } catch (error) {
      return error;
    }
  };
  return (
    <Modal opened={opened} onClose={close} title="Agregar clip" centered>
      <form onSubmit={form.onSubmit((values) => handleSave(values))}>
        <TextInput
          title="Agregar titulo"
          label="Titulo del clip"
          data-autofocus
          withAsterisk
          key={form.key("title")}
          {...form.getInputProps("title")}
        />
        <TagsInput
          label="Tags"
          placeholder="Enter para agregar tag"
          key={form.key("tags")}
          {...form.getInputProps("tags")}
        />
        <TextInput
          title="EmbedURL"
          label="URL del Embed"
          key={form.key("embed")}
          withAsterisk
          {...form.getInputProps("embed")}
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleModalsCancel} variant="default" color="gray">
            Cancelar
          </Button>
          <Button type="submit">Agregar Clip</Button>
        </Group>
      </form>
    </Modal>
  );
};
