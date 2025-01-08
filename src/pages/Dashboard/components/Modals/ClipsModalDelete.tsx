import { Button, Group, Modal, Text } from "@mantine/core";
import { Props } from "./ClipsModalAdd";
import { useCallback } from "react";

export const ClipsModalDelete = ({ opened, close, refetch }: Props) => {
  const handleModalsCancel = useCallback(() => {
    close();
  }, [close]);

  const handleDeleteClip = () => {
    console.log("Se elimino el clip");
    refetch();
  };
  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        title="Eliminar Clip"
        centered
        radius={15}
      >
        <Text>
          Estas seguro de realizar esta accion con el clip "nombre del clip"
        </Text>
        <Group justify="flex-end" mt="md">
          <Button onClick={handleModalsCancel} variant="default" color="gray">
            Cancelar
          </Button>
          <Button onClick={handleDeleteClip}>Eliminar Clip</Button>
        </Group>
      </Modal>
    </div>
  );
};
