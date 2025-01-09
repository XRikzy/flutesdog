import { Button, Group, Modal, TagsInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AddClipValues, EditVideos } from "../../../../constants/documents";
import { useAddClips } from "../../../../hooks/Clips/useAddClips";
import { useCallback } from "react";
import { useClipsEditForm } from "../../hook/useClipsEditForm";

type EditProps = {
  opened: boolean;
  close: () => void;
  refetch: () => void;
  data: EditVideos
};

export const ClipModalEdit = ({ opened, close, refetch, data }: EditProps) => {
  
  const { editForm } = useClipsEditForm(data)
  const { addData, error, loading } = useAddClips();
  const handleModalsCancel = useCallback(() => {
    close();
    editForm.reset();
  }, [close, editForm]);

  const handleButtonState = useCallback(
    (values: AddClipValues) => {
      try {
        addData(values);
        refetch();
        notifications.show({
          title: "Lo datos se han actualizado",
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
      <form onSubmit={editForm.onSubmit(handleButtonState)}>
        <TextInput
          title="Agregar titulo"
          label="Titulo del clip"
          data-autofocus
          withAsterisk
          key={editForm.key("title")}
          {...editForm.getInputProps("title")}
        />
        <TagsInput
          label="Tags"
          placeholder="Enter para agregar tag"
          key={editForm.key("tag")}
          {...editForm.getInputProps("tag")}
        />
        <TextInput
          title="EmbedURL"
          label="URL del Embed"
          key={editForm.key("embed")}
          withAsterisk
          {...editForm.getInputProps("embed")}
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleModalsCancel} variant="default" color="gray">
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            Editar Clip
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
