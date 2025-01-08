import { Button, Group, Modal, TagsInput, TextInput } from "@mantine/core";

import { notifications } from "@mantine/notifications";
import { AddClipValues } from "../../../../constants/documents";
import { useAddClips } from "../../../../hooks/Clips/useAddClips";
import { useClipsForm } from "../../hook/useClipsForm";
import { useCallback } from "react";

export type Props = {
  opened: boolean;
  close: () => void;
  refetch: () => void;
};

export const ClipsModalAdd = ({ opened, close, refetch }: Props) => {
  const { form } = useClipsForm();
  const { addData, error, loading } = useAddClips();
  const handleModalsCancel = useCallback(() => {
    close();
    form.reset();
  }, [close, form]);

  const handleButtonState = useCallback(
    (values: AddClipValues) => {
      try {
        addData(values);
        refetch();
        notifications.show({
          title: "Lo datos se han agregado",
          message: "Visita los clips para ver el nuevo clip!!",
        });
        handleModalsCancel();
      } catch {
        notifications.show({
          title: "Oops paso algo",
          message: error,
        });
      }
    },
    [addData, refetch, handleModalsCancel, error]
  );
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Agregar clip"
      centered
      radius={15}
    >
      <form onSubmit={form.onSubmit(handleButtonState)}>
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
          <Button type="submit" loading={loading}>
            Agregar Clip
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
