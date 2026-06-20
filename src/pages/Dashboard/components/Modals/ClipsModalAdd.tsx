import { useRef, useState, useCallback } from "react";
import { Button, Group, Modal, TagsInput, TextInput } from "@mantine/core";
import { IKContext, IKUpload } from "imagekitio-react";
import { IconUpload, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { notifications } from "@mantine/notifications";
import { AddClipValues } from "../../../../constants/documents";
import { useAddClips } from "../../../../hooks/Clips/useAddClips";
import { authenticateScreeshotService } from "../../../Screenshots/service/screenshot.service";
import classes from "./ClipsModalAdd.module.css";
import { useForm } from "@mantine/form";

const PUBLIC_KEY = "public_4e8z8SiIt6dIJn8XIwm4T1pjqpc=";
const URL_ENDPOINT = "https://ik.imagekit.io/ru9ftzizk/";
const MAX_SIZE_MB = 240;
const ACCEPTED_FORMATS = "video/mp4,video/quicktime,video/webm";
const ACCEPTED_EXTENSIONS = ".mp4,.mov,.webm";

export type Props = {
  opened: boolean;
  close: () => void;
  refetch: () => void;
};

export const ClipsModalAdd = ({ opened, close, refetch }: Props) => {
  const { addData, loading } = useAddClips();
  const IKUploadRef = useRef<HTMLInputElement | null>(null);

  // Estado del upload
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "done" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { title: "", tag: ["Gracioso"] as string[] },
    validate: {
      title: (v: string) => (v.trim() === "" ? "Escribe un título primero" : null),
    },
  });

  const authenticator = async () => {
    try {
      return await authenticateScreeshotService();
    } catch (error) {
      throw new Error(`Auth error: ${error}`);
    }
  };

  const handleReset = useCallback(() => {
    form.reset();
    setUploadState("idle");
    setUploadProgress(0);
    setUploadedUrl("");
    setSelectedFileName("");
  }, [form]);

  const handleClose = useCallback(() => {
    handleReset();
    close();
  }, [close, handleReset]);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    if (!file.type.match(/video\/(mp4|quicktime|webm)/)) {
      notifications.show({ title: "Formato inválido", message: "Solo se aceptan MP4, MOV y WEBM.", color: "red" });
      return;
    }
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > MAX_SIZE_MB) {
      notifications.show({ title: "Archivo muy grande", message: `El video no puede superar ${MAX_SIZE_MB}MB. Este pesa ${sizeMB.toFixed(0)}MB.`, color: "red" });
      return;
    }
    setSelectedFileName(file.name);
    setUploadState("uploading");
    setUploadProgress(0);
    IKUploadRef.current?.click();
  };

  const handleSubmit = useCallback(
    async (values: { title: string; tag: string[] }) => {
      if (!uploadedUrl) return;
      try {
        const clipData: AddClipValues = {
          title: values.title,
          tag: values.tag,
          videoUrl: uploadedUrl,
        };
        await addData(clipData);
        refetch();
        notifications.show({ title: "¡Clip agregado!", message: "El video se ha subido y guardado correctamente." });
        handleClose();
      } catch {
        notifications.show({ title: "Error", message: "No pudimos guardar el clip.", color: "red" });
      }
    },
    [uploadedUrl, addData, refetch, handleClose]
  );

  const canSave = uploadState === "done" && uploadedUrl !== "";

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Agregar clip"
      centered
      radius={15}
      size="md"
    >
      <IKContext
        publicKey={PUBLIC_KEY}
        urlEndpoint={URL_ENDPOINT}
        authenticator={authenticator}
      >
        {/* Input oculto de ImageKit */}
        <IKUpload
          ref={IKUploadRef}
          urlEndpoint={URL_ENDPOINT}
          fileName={selectedFileName || "clip.mp4"}
          folder="Flutesdog/clips"
          accept={ACCEPTED_FORMATS}
          onUploadProgress={(p) =>
            setUploadProgress(Math.round((p.loaded / p.total) * 100))
          }
          onSuccess={(res) => {
            setUploadedUrl(res.url);
            setUploadState("done");
          }}
          onError={() => {
            setUploadState("error");
            notifications.show({ title: "Error de subida", message: "No pudimos subir el video a ImageKit.", color: "red" });
          }}
          hidden
        />

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
                  <p className={classes.dropHint}>MP4, MOV, WEBM · máx. {MAX_SIZE_MB}MB</p>
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

          <Group justify="flex-end" mt="md">
            <Button onClick={handleClose} variant="default" color="gray">
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!canSave}
              title={!canSave ? "Primero sube un video" : ""}
            >
              Guardar clip
            </Button>
          </Group>
        </form>
      </IKContext>
    </Modal>
  );
};
