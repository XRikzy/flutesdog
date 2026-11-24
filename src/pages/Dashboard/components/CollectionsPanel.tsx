import { useState } from "react";
import { Alert, Button, Group, MultiSelect, Select, Stack, Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCollections } from "../../../hooks/useCollections";
import { useGetClips } from "../../../hooks/Clips/useGetClips";
import { useAddScreenshot } from "../../Screenshots/hook/useAddScreenshot";
import { saveCollection, setFeaturedCollection, type CollectionValues } from "../../../services/collections";

const empty: CollectionValues = { title: "", description: "", clipIds: [], screenshotIds: [] };

function options(items: { value: string; label: string }[], selected: string[]) {
  const known = new Set(items.map(({ value }) => value));
  return [...items, ...selected.filter((value) => !known.has(value)).map((value) => ({ value, label: "Archivo no disponible" }))];
}

export function CollectionsPanel() {
  const { data, loading, error, reload } = useCollections();
  const { data: clips, loading: loadingClips, error: clipsError } = useGetClips();
  const { images, loading: loadingImages } = useAddScreenshot();
  const [id, setId] = useState("");
  const [saving, setSaving] = useState(false);
  const [featuring, setFeaturing] = useState(false);
  const form = useForm<CollectionValues>({
    initialValues: empty,
    validate: { title: (value) => value.trim() ? null : "Escribe un título." },
  });
  const items = data?.items ?? [];
  const choices = items.map((item) => ({ value: item.id, label: item.title }));
  const clipOptions = options(clips.map((clip) => ({ value: clip.id, label: clip.title || "Clip" })), form.values.clipIds);
  const imageOptions = options(images.flatMap((image) => image.fileId ? [{ value: image.fileId, label: image.name }] : []), form.values.screenshotIds);

  const selectCollection = (nextId: string) => {
    const item = items.find((entry) => entry.id === nextId);
    setId(nextId);
    form.setValues(item ?? empty);
    form.clearErrors();
  };

  const save = async (values: CollectionValues) => {
    setSaving(true);
    try {
      const { title, description, clipIds, screenshotIds } = values;
      await saveCollection(id, { title, description, clipIds, screenshotIds });
      selectCollection("");
      reload();
      notifications.show({ message: "Colección guardada." });
    } catch {
      notifications.show({ color: "red", message: "No pudimos guardar la colección." });
    } finally {
      setSaving(false);
    }
  };

  const feature = async (nextId: string | null) => {
    setFeaturing(true);
    try {
      await setFeaturedCollection(nextId ?? "");
      reload();
    } catch {
      notifications.show({ color: "red", message: "No pudimos actualizar la colección destacada." });
    } finally {
      setFeaturing(false);
    }
  };

  return (
    <Stack>
      <Title order={2}>Colecciones</Title>
      {error && <Alert color="red">No pudimos cargar las colecciones. <Button size="compact-xs" onClick={reload}>Reintentar</Button></Alert>}
      {clipsError && <Alert color="red">{clipsError}</Alert>}
      <Select label="Destacada en portada" data={choices} value={data?.featuredId || null} onChange={feature} clearable disabled={loading || error || featuring} />
      <Select label="Editar colección" placeholder="Nueva colección" data={choices} value={id || null} onChange={(nextId) => selectCollection(nextId ?? "")} clearable disabled={loading || saving} />
      <form onSubmit={form.onSubmit(save)}>
        <Stack>
          <TextInput label="Título" maxLength={80} required {...form.getInputProps("title")} />
          <Textarea label="Descripción" maxLength={300} {...form.getInputProps("description")} />
          <MultiSelect label="Clips" searchable data={clipOptions} disabled={loadingClips || saving} {...form.getInputProps("clipIds")} />
          <MultiSelect label="Capturas" searchable data={imageOptions} disabled={loadingImages || saving} {...form.getInputProps("screenshotIds")} />
          <Group justify="flex-end">
            <Button type="submit" loading={saving} disabled={loading || error}>{id ? "Guardar cambios" : "Crear colección"}</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
