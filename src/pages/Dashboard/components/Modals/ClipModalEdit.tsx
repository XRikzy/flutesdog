import { Button, Group, Modal, TagsInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { EditVideos } from "../../../../constants/documents";
import { useEditClips } from "../../../../hooks/Clips/useEditClips";
import { useCallback, useEffect } from "react";
import { useClipsEditForm } from "../../hook/useClipsEditForm";

type EditProps = {
  opened: boolean;
  close: () => void;
  refetch: () => void;
  data: EditVideos;
};

export const ClipModalEdit = ({ opened, close, refetch, data }: EditProps) => {
  const { editForm } = useClipsEditForm(data);
  const { editData, error, loading } = useEditClips();

  // Resetear el formulario con la nueva data cuando se abra el modal
  useEffect(() => {
    if (opened && data) {
      editForm.setValues({
        title: data.title || "",
        tag: data.tag || [],
        embed: data.embed || "",
        videoUrl: data.videoUrl || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, data]);

  const handleModalsCancel = useCallback(() => {
    close();
    editForm.reset();
  }, [close, editForm]);

  const handleButtonState = useCallback(
    async (values: typeof editForm.values) => {
      try {
        const payload: {
          title: string;
          tag: string[];
          embed?: string;
          videoUrl?: string;
        } = {
          title: values.title,
          tag: values.tag,
        };

        if (data.videoUrl) {
          payload.videoUrl = data.videoUrl;
        } else {
          payload.embed = values.embed;
        }

        await editData(data.id, payload);
        refetch();
        notifications.show({
          title: "Datos actualizados",
          message: `El clip "${values.title}" se ha actualizado correctamente.`,
          color: "blue",
        });
        handleModalsCancel();
      } catch (err: any) {
        notifications.show({
          title: "Oops, pasó algo",
          message: error || err.message || "No se pudo actualizar el clip.",
          color: "red",
        });
      }
    },
    [editData, data.id, data.videoUrl, refetch, handleModalsCancel, error]
  );

  return (
    <Modal
      opened={opened}
      onClose={handleModalsCancel}
      title="Editar clip"
      centered
      radius="md"
      styles={{
        header: {
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
        },
        body: {
          background: "var(--bg-surface)",
          paddingTop: "20px",
        },
      }}
    >
      <form onSubmit={editForm.onSubmit(handleButtonState)}>
        <TextInput
          label="Título del clip"
          placeholder="Escribe el título"
          withAsterisk
          key={editForm.key("title")}
          {...editForm.getInputProps("title")}
        />

        <TagsInput
          label="Tags"
          placeholder="Presiona Enter para agregar"
          mt="md"
          key={editForm.key("tag")}
          {...editForm.getInputProps("tag")}
        />

        {data.videoUrl ? (
          <TextInput
            label="Video URL (ImageKit)"
            value={data.videoUrl}
            disabled
            mt="md"
            styles={{
              input: {
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                color: "var(--text-muted)",
                borderColor: "var(--border)",
              },
            }}
          />
        ) : (
          <TextInput
            label="URL del Embed (YouTube)"
            placeholder="https://www.youtube.com/embed/..."
            withAsterisk
            mt="md"
            key={editForm.key("embed")}
            {...editForm.getInputProps("embed")}
          />
        )}

        <Group justify="flex-end" mt="xl">
          <Button
            onClick={handleModalsCancel}
            variant="default"
            styles={{
              root: {
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                "&:hover": {
                  backgroundColor: "var(--bg-hover)",
                },
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            styles={{
              root: {
                backgroundColor: "var(--accent)",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(0, 85, 255, 0.8)",
                },
              },
            }}
          >
            Guardar cambios
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
