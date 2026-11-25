import { useEffect, useRef, useState } from "react";
import { Alert, Button, FileButton, Group, ScrollArea, SimpleGrid, Skeleton, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconPhotoPlus, IconPlayerPlay, IconSearch } from "@tabler/icons-react";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { saveCollection, type CollectionValues, type MediaCollection } from "../../services/collections";
import { uploadMedia } from "../../services/uploadMedia";
import { getClipThumbnail } from "../../utils/clipThumbnail";
import { useAddScreenshot } from "../Screenshots/hook/useAddScreenshot";
import { CollectionCover, collectionCoverSources } from "./CollectionCover";
import classes from "./Collections.module.css";

interface MediaChoice {
  id: string;
  title: string;
  image?: string;
}

function MediaPicker({ label, choices, value, onChange, loading, disabled, video }: {
  label: string;
  choices: MediaChoice[];
  value: string[];
  onChange: (ids: string[]) => void;
  loading: boolean;
  disabled: boolean;
  video?: boolean;
}) {
  const [query, setQuery] = useState("");
  const filtered = choices.filter((choice) => choice.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return (
    <fieldset className={classes.picker} disabled={disabled}>
      <legend>{label} · {value.length} seleccionados</legend>
      <Stack gap="sm">
        <TextInput aria-label={`Buscar ${label.toLowerCase()}`} placeholder={`Buscar ${label.toLowerCase()}`}
          value={query} onChange={(event) => setQuery(event.currentTarget.value)} leftSection={<IconSearch size={16} />} />
        {loading ? <Skeleton h={90} /> : filtered.length ? (
          <ScrollArea.Autosize mah={290} offsetScrollbars>
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xs">
              {filtered.map((choice) => {
                const selected = value.includes(choice.id);
                return (
                  <button key={choice.id} type="button" className={classes.choice} aria-pressed={selected}
                    onClick={() => onChange(selected ? value.filter((id) => id !== choice.id) : [...value, choice.id])}>
                    <span className={classes.choiceMedia}>
                      {choice.image && <img src={choice.image} alt="" loading="lazy"
                        onError={(event) => { event.currentTarget.hidden = true; }} />}
                      {video && <IconPlayerPlay className={classes.choicePlay} aria-hidden="true" size={19} />}
                      {selected && <IconCheck className={classes.choiceCheck} aria-hidden="true" size={17} />}
                    </span>
                    <span className={classes.choiceTitle}>{choice.title}</span>
                  </button>
                );
              })}
            </SimpleGrid>
          </ScrollArea.Autosize>
        ) : <Text size="sm" c="dimmed">No hay resultados.</Text>}
      </Stack>
    </fieldset>
  );
}

export function CollectionEditor({ item, onSaved, onBusyChange }: {
  item?: MediaCollection;
  onSaved: (id: string) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const { data: clips, loading: loadingClips, error: clipError } = useGetClips();
  const { images, loading: loadingImages } = useAddScreenshot();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const fileReset = useRef<() => void>(null);
  const uploaded = useRef<{ file: File; url: string }>();
  const form = useForm<CollectionValues>({
    initialValues: {
      title: item?.title || "", description: item?.description || "",
      clipIds: item?.clipIds || [], screenshotIds: item?.screenshotIds || [], coverUrl: item?.coverUrl || "",
    },
    validate: { title: (value) => value.trim() ? null : "Escribe un título." },
  });

  useEffect(() => {
    if (!coverFile) return;
    const url = URL.createObjectURL(coverFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const chooseCover = (file: File | null) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || !file.size || file.size > 10 * 1024 * 1024) {
      setError("Elige una imagen JPG, PNG o WebP de hasta 10 MiB.");
      fileReset.current?.();
      return;
    }
    setError("");
    setCoverFile(file);
    setPreview("");
  };

  const save = async (values: CollectionValues) => {
    if (saving) return;
    setSaving(true);
    onBusyChange?.(true);
    setError("");
    try {
      let coverUrl = values.coverUrl || "";
      if (coverFile) {
        if (uploaded.current?.file === coverFile) coverUrl = uploaded.current.url;
        else {
          setProgress(0);
          coverUrl = await uploadMedia(coverFile, "collection-cover", setProgress);
          uploaded.current = { file: coverFile, url: coverUrl };
        }
      }
      const id = await saveCollection(item?.id || "", { ...values, coverUrl });
      onSaved(id);
    } catch (error) {
      setError(error instanceof Error && error.message !== "Missing or insufficient permissions."
        ? error.message
        : "No pudimos guardar la colección. Comprueba tu sesión y vuelve a intentarlo.");
    } finally {
      setProgress(null);
      setSaving(false);
      onBusyChange?.(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(save)}>
      <Stack gap="lg">
        <TextInput label="Título" maxLength={80} required disabled={saving} {...form.getInputProps("title")} />
        <Textarea label="Descripción" maxLength={300} disabled={saving} {...form.getInputProps("description")} />
        <Stack gap="xs">
          <Text fw={600}>Vista previa de la portada</Text>
          <div className={classes.coverPreview}>
            <CollectionCover sources={[
              ...(coverFile && preview ? [preview] : []), ...collectionCoverSources(form.values, images),
            ]} />
          </div>
          <Group gap="sm">
            <FileButton onChange={chooseCover} resetRef={fileReset} accept="image/jpeg,image/png,image/webp">
              {(props) => <Button {...props} disabled={saving} variant="light" leftSection={<IconPhotoPlus size={17} />}>
                {coverFile || form.values.coverUrl ? "Cambiar portada" : "Subir portada"}
              </Button>}
            </FileButton>
            {(coverFile || form.values.coverUrl) && <Button disabled={saving} variant="subtle" onClick={() => {
              setCoverFile(null);
              form.setFieldValue("coverUrl", "");
              fileReset.current?.();
            }}>Quitar portada propia</Button>}
          </Group>
          <Text size="xs" c="dimmed">Sin portada propia, se usa la primera captura disponible de la colección.</Text>
        </Stack>
        {clipError && <Alert color="red">{clipError}</Alert>}
        <MediaPicker label="Capturas" choices={images.flatMap((image) => image.fileId && image.url
          ? [{ id: image.fileId, title: image.name, image: image.thumbnail || image.url }] : [])}
          value={form.values.screenshotIds} onChange={(ids) => form.setFieldValue("screenshotIds", ids)}
          loading={loadingImages} disabled={saving} />
        <MediaPicker label="Clips" choices={clips.map((clip) => ({
          id: clip.id, title: clip.title || "Clip", image: getClipThumbnail(clip),
        }))} value={form.values.clipIds} onChange={(ids) => form.setFieldValue("clipIds", ids)}
          loading={loadingClips} disabled={saving} video />
        {error && <Alert color="red" role="alert">{error}</Alert>}
        {progress !== null && <Text size="sm" role="status">Subiendo portada · {progress}%</Text>}
        <Group justify="flex-end">
          <Button type="submit" loading={saving}>{item ? "Guardar cambios" : "Crear colección"}</Button>
        </Group>
      </Stack>
    </form>
  );
}
