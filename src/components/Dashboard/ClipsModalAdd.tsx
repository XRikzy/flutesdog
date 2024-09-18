import { Modal } from "@mantine/core";
type Props = {
  opened: boolean;
  close: () => void;
};
export const ClipsModalAdd = ({ opened, close }: Props) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Agregar nuevo Clip"
      centered
    ></Modal>
  );
};
