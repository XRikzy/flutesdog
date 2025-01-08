import { Button, Group, Modal, Text } from "@mantine/core";
import { useCallback } from "react";
import { useDeleteClips } from "../../../../hooks/Clips/useDeleteClips";
import { notifications } from "@mantine/notifications";
type DeleteProp = {
  opened: boolean;
  refetch: () => void;
  close: () => void;
  id: string;
  title: string;
};
export const ClipsModalDelete = ({
  opened,
  close,
  refetch,
  id,
  title,
}: DeleteProp) => {
  const { deleteData, error, loading } = useDeleteClips();
  const handleModalsCancel = useCallback(() => {
    close();
  }, [close]);

  const handleDeleteClip = useCallback(async () => {
    try {
      deleteData(id);
      refetch();
      notifications.show({
        title: "Se elimino el clip",
        message: `El clip ${title} se ha eliminado correctamente`,
      });
      handleModalsCancel();
    } catch {
      notifications.show({
        title: "Oops paso algo",
        message: error,
      });
    }
  }, [refetch, id, title, handleModalsCancel, deleteData, error]);
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Eliminar Clip"
      centered
      radius={15}
    >
      <Text>
        ¿Estás seguro de realizar esta accion con el clip {title}? Esta accion
        es irrebersible
      </Text>
      <Group justify="flex-end" mt="md">
        <Button onClick={handleModalsCancel} variant="default" color="gray">
          Cancelar
        </Button>
        <Button color="red" onClick={handleDeleteClip} loading={loading}>
          Eliminar Clip
        </Button>
      </Group>
    </Modal>
  );
};
