import { Button, Group, Modal, TagsInput, TextInput } from "@mantine/core";

import { notifications } from "@mantine/notifications";
import { AddClipValues } from "../../../constants/documents";
import { useAddClips } from "../../../hooks/Clips/useAddClips";
import { useClipsForm } from "../hook/useClipsForm";

type Props = {
  opened: boolean;
  close: () => void;
};

export const ClipsModalAdd = ({ opened, close }: Props) => {
  const { form } = useClipsForm();
  const { addData, error, errorState, loading } = useAddClips();
  const handleModalsCancel = () => {
    close();
    form.reset();
  };
  const handleButtonState = (values: AddClipValues) => {
    if (loading) {
      addData(values);
      notifications.show({
        title: "Lo datos se han agregado",
        message: "Visita los clips para ver el nuevo clip!!",
      });
      close();
    }
    if (errorState) {
      notifications.show({
        title: "Oops paso algo",
        message: error,
      });
    }
  };
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Agregar clip"
      centered
      radius={15}
    >
      <form onSubmit={form.onSubmit((values) => handleButtonState(values))}>
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
          <Button type="submit" loading={!loading}>
            Agregar Clip
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
