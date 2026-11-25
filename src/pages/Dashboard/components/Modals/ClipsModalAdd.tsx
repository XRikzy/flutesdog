import { useState, useCallback, useEffect, useRef } from "react";
import { Button, FileButton, Group, Image, Modal, Stack, TagsInput, Text, TextInput } from "@mantine/core";
import { IconUpload, IconCheck, IconAlertCircle, IconPhotoPlus } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { notifications } from "@mantine/notifications";
import { AddClipValues } from "../../../../constants/documents";
import { useAddClips } from "../../../../hooks/Clips/useAddClips";
import { uploadMedia } from "../../../../services/uploadMedia";
import classes from "./ClipsModalAdd.module.css";
import { useForm } from "@mantine/form";

const MAX_SIZE_MIB = 240;
const ACCEPTED_EXTENSIONS = ".mp4,.mov,.webm";

export type Props = {
  opened: boolean;
  close: () => void;
  refetch: () => void;
};

export const ClipsModalAdd = ({ opened, close, refetch }: Props) => {
  const { addData, loading } = useAddClips();

  // Estado del upload
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "done" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const thumbnailInput = useRef<() => void>(null);
  const uploadedThumbnail = useRef<{ file: File; url: string }>();
  const busy = loading || saving;
  const uploadInProgress = uploadState === "uploading";

  useEffect(() => {
    if (!thumbnail) return;
    const url = URL.createObjectURL(thumbnail);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnail]);

  const clearThumbnail = useCallback(() => {
    setThumbnail(null);
    setThumbnailPreview("");
    uploadedThumbnail.current = undefined;
    thumbnailInput.current?.();
  }, []);

  const selectThumbnail = (file: File | null) => {
    if (!file || busy) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || !file.size || file.size > 10 * 1024 * 1024) {
      notifications.show({ color: "red", message: "Elige una miniatura JPG, PNG o WebP de hasta 10 MiB." });
      thumbnailInput.current?.();
      return;
    }
    setThumbnail(file);
    setThumbnailPreview("");
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { title: "", tag: ["Gracioso"] as string[] },
    validate: {
      title: (v: string) => (v.trim() === "" ? "Escribe un título primero" : null),
    },
  });

  const handleReset = useCallback(() => {
    form.reset();
    setUploadState("idle");
    setUploadProgress(0);
    setUploadedUrl("");
    setSelectedFileName("");
    clearThumbnail();
  }, [form, clearThumbnail]);

  const handleClose = useCallback(() => {
    handleReset();
    close();
  }, [close, handleReset]);

  const handleFileSelect = async (file: File | null) => {
    if (!file || uploadInProgress || uploadState === "done") return;
    if (!/^video\/(mp4|quicktime|webm)$/.test(file.type)) {
      notifications.show({ title: "Formato inválido", message: "Solo se aceptan MP4, MOV y WEBM.", color: "red" });
      return;
    }
    const sizeMiB = file.size / 1024 / 1024;
    if (sizeMiB > MAX_SIZE_MIB) {
      notifications.show({ title: "Archivo muy grande", message: `El máximo es ${MAX_SIZE_MIB} MiB por video.`, color: "red" });
      return;
    }
    setSelectedFileName(file.name);
    setUploadState("uploading");
    setUploadProgress(0);
    try {
      setUploadedUrl(await uploadMedia(file, "clip", setUploadProgress));
      setUploadState("done");
    } catch (error) {
      setUploadState("error");
      notifications.show({
        title: "Error de subida",
        message: error instanceof Error ? error.message : "No pudimos subir el video.",
        color: "red",
      });
    }
  };

  const handleSubmit = useCallback(
    async (values: { title: string; tag: string[] }) => {
      if (!uploadedUrl || busy) return;
      setSaving(true);
      try {
        let thumbnailUrl: string | undefined;
        if (thumbnail) {
          if (uploadedThumbnail.current?.file === thumbnail) thumbnailUrl = uploadedThumbnail.current.url;
          else {
            thumbnailUrl = await uploadMedia(thumbnail, "clip-thumbnail", () => {});
            uploadedThumbnail.current = { file: thumbnail, url: thumbnailUrl };
          }
        }
        const clipData: AddClipValues = {
          title: values.title,
          tag: values.tag,
          videoUrl: uploadedUrl,
          thumbnailUrl,
        };
        await addData(clipData);
        refetch();
        notifications.show({ title: "¡Clip agregado!", message: "El video se ha subido y guardado correctamente." });
        handleClose();
      } catch (error) {
        notifications.show({ title: "Error", message: error instanceof Error ? error.message : "No pudimos guardar el clip.", color: "red" });
      } finally {
        setSaving(false);
      }
    },
    [uploadedUrl, thumbnail, busy, addData, refetch, handleClose]
  );

  const canSave = uploadState === "done" && uploadedUrl !== "";

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      withCloseButton={!uploadInProgress && !busy}
      closeOnEscape={!uploadInProgress && !busy}
      closeOnClickOutside={!uploadInProgress && !busy}
      title="Agregar clip"
      centered
      radius={15}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* Título */}
        <TextInput
          label="Título del clip"
          placeholder="Ej: Jose se cae del puente"
          withAsterisk
          mb="sm"
          key={form.key("title")}
          {...form.getInputProps("title")}
        />

        {/* Tags */}
        <TagsInput
          label="Tags"
          placeholder="Enter para agregar tag"
          mb="md"
          key={form.key("tag")}
          {...form.getInputProps("tag")}
        />

        {/* Zona de drag & drop */}
        <div
          className={`${classes.dropZone} ${isDragging ? classes.dropZoneDragging : ""} ${uploadState === "done" ? classes.dropZoneDone : ""} ${uploadState === "error" ? classes.dropZoneError : ""}`}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const f = e.dataTransfer.files[0] ?? null;
            handleFileSelect(f);
          }}
          onClick={() => {
            if (uploadState === "idle" || uploadState === "error") {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ACCEPTED_EXTENSIONS;
              input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files?.[0] ?? null);
              input.click();
            }
          }}
        >
          <AnimatePresence mode="wait">
            {uploadState === "idle" && (
              <motion.div
                key="idle"
                className={classes.dropContent}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <IconUpload size={28} stroke={1.5} color="var(--text-muted)" />
                <p className={classes.dropTitle}>Arrastra tu video aquí</p>
                <p className={classes.dropSub}>o haz clic para seleccionar</p>
                <p className={classes.dropHint}>MP4, MOV, WebM</p>
              </motion.div>
            )}

            {uploadState === "uploading" && (
              <motion.div
                key="uploading"
                className={classes.dropContent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className={classes.dropTitle} style={{ marginBottom: 12 }}>
                  Subiendo video…
                </p>
                <div className={classes.progressBar}>
                  <motion.div
                    className={classes.progressFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className={classes.dropHint} style={{ marginTop: 8 }}>
                  {uploadProgress}% completado
                </p>
                <p className={classes.dropSub}>{selectedFileName}</p>
              </motion.div>
            )}

            {uploadState === "done" && (
              <motion.div
                key="done"
                className={classes.dropContent}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <IconCheck size={32} stroke={2} color="var(--accent)" />
                </motion.div>
                <p className={classes.dropTitle}>Video subido correctamente</p>
                <p className={classes.dropSub}>{selectedFileName}</p>
              </motion.div>
            )}

            {uploadState === "error" && (
              <motion.div
                key="error"
                className={classes.dropContent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <IconAlertCircle size={28} stroke={1.5} color="#ff4444" />
                <p className={classes.dropTitle} style={{ color: "#ff4444" }}>
                  Error al subir
                </p>
                <p className={classes.dropSub}>Haz clic para intentar de nuevo</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Text size="sm" c="dimmed" mt="xs">Máximo de {MAX_SIZE_MIB} MiB por video.</Text>

        <Stack gap="xs" mt="md">
          <Text size="sm" fw={600}>Miniatura opcional</Text>
          <Image src={thumbnail && thumbnailPreview ? thumbnailPreview : "/assets/hero.png"}
            fallbackSrc="/assets/hero.png" alt="Vista previa de la miniatura" radius="sm"
            style={{ aspectRatio: "16 / 9", maxWidth: 260, objectFit: "cover" }} />
          <Group gap="xs">
            <FileButton resetRef={thumbnailInput} onChange={selectThumbnail} accept="image/jpeg,image/png,image/webp">
              {(props) => <Button {...props} type="button" variant="light" size="xs" disabled={busy} leftSection={<IconPhotoPlus size={16} />}>
                {thumbnail ? "Cambiar miniatura" : "Elegir miniatura"}
              </Button>}
            </FileButton>
            {thumbnail && <Button type="button" size="xs" variant="subtle" disabled={busy} onClick={clearThumbnail}>Usar predeterminada</Button>}
          </Group>
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button onClick={handleClose} disabled={uploadInProgress || busy} variant="default" color="gray">
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={busy}
            disabled={!canSave}
            title={!canSave ? "Primero sube un video" : ""}
          >
            Guardar clip
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
