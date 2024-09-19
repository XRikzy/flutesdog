import { ActionIcon, TagsInput, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";

export const ClipsModalAdd = () => {
  const openModal = () =>
    modals.openConfirmModal({
      title: "Agregar Clip",
      centered: true,
      radius:'lg',
      children: (
        <>
          <TextInput
            title="Agregar titulo"
            label="Titulo del clip"
            data-autofocus
          />
          <TagsInput
            label="Tags"
            placeholder="Enter para agregar tag"
            defaultValue={["Gracioso"]}
          />
          <TextInput title="EmbedURL" label="URL del Embed" />
        </>
      ),
      labels: { confirm: "Agregar Clip", cancel: "Cancelar" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => console.log("Confirmed"),
    });
  return (
    <ActionIcon onClick={openModal}>
      <IconPlus style={{ width: "70%", height: "70%" }} stroke={2} />
    </ActionIcon>
  );
};
