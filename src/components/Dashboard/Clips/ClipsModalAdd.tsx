import { Button, Group, Modal, TagsInput, TextInput } from "@mantine/core";

import { useClipsForm } from "./hook/useClipsForm";
import { useAddClips } from "../../../hooks/Clips/useAddClips";

type Props = {
  opened: boolean;
  close: () => void;
};

export const ClipsModalAdd = ({ opened, close }: Props) => {
  const { form } = useClipsForm();
  const { addData, error, loading } = useAddClips();
  const handleModalsCancel = () => {
    close();
    form.reset();
  };
  const handleButtonState = () => {
    
  };
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Agregar clip"
      centered
      radius={15}
    >
      <form onSubmit={form.onSubmit((values) => addData(values))}>
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
          key={form.key("tag")}
          {...form.getInputProps("tag")}
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
          <Button type="submit" onClick={handleButtonState} loading={loading}>
            Agregar Clip
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
