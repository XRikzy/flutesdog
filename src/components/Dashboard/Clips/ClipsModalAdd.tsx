import { ActionIcon, Button, Group, TagsInput, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { useClipsForm } from "./hook/useClipsForm";

export const ClipsModalAdd = () => {
  const { form } = useClipsForm();
  const handleModalsCancel = () => {
    modals.closeAll();
    form.reset();
  };
  const openModal = () =>
    modals.open({
      title: "Agregar Clip",
      centered: true,
      radius: "lg",
      children: (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
            defaultValue={["Gracioso"]}
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
      ),
    });
  return (
    <ActionIcon onClick={openModal}>
      <IconPlus style={{ width: "70%", height: "70%" }} stroke={2} />
    </ActionIcon>
  );
};
