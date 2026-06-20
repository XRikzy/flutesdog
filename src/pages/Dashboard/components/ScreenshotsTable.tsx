import { useState, useCallback, useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import { Tooltip, TextInput, rem, Modal, Button, Text, Group } from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconTrash,
  IconPhoto,
  IconExternalLink,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { motion, AnimatePresence } from "framer-motion";
import { useAddScreenshot } from "../../Screenshots/hook/useAddScreenshot";
import { deleteScreenshotImage } from "../../Screenshots/service/screenshot.service";
import classes from "./ScreenshotsTable.module.css";

function formatSize(bytes?: number): string {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(dateVal?: any): string {
  if (!dateVal) return "-";
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
}

export function ScreenshotsTable() {
  const {
    authenticator,
    images,
    loading,
    publicKey,
    urlEndpoint,
    fetchImages,
  } = useAddScreenshot();

  const IKUploadRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Control de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState<string>("");
  const [deleteFileName, setDeleteFileName] = useState<string>("");
  const [deleting, setDeleting] = useState(false);

  const handleOpenDelete = (fileId: string, name: string) => {
    setDeleteFileId(fileId);
    setDeleteFileName(name);
    setDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteFileId("");
    setDeleteFileName("");
    setDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteFileId) return;
    setDeleting(true);
    try {
      await deleteScreenshotImage(deleteFileId);
      fetchImages();
      notifications.show({
        title: "Screenshot eliminada",
        message: `La screenshot "${deleteFileName}" se ha eliminado correctamente.`,
        color: "blue",
      });
      handleCloseDelete();
    } catch (err: any) {
      notifications.show({
        title: "Oops, pasó algo",
        message: err.message || "No se pudo eliminar la screenshot.",
        color: "red",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleOnSuccess = useCallback(() => {
    fetchImages();
    notifications.show({
      title: "¡Agregado!",
      message: "Screenshot subida correctamente.",
      color: "blue",
    });
    setProgress(0);
  }, [fetchImages]);

  const safeImages = Array.isArray(images) ? images : [];
  const filteredImages = safeImages.filter((img) =>
    img?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rows = filteredImages.map((row) => {
    const fileId = row.fileId || "";
    const sizeStr = formatSize(row.size);
    const dateStr = formatDate(row.createdAt);

    return (
      <tr key={row.fileId || row.name} className={classes.tr}>
        {/* Preview Thumbnail */}
        <td className={classes.td}>
          <a href={row.url} target="_blank" rel="noopener noreferrer">
            <div className={classes.screenshotImgWrapper}>
              <img
                src={row.thumbnail || row.url}
                alt={row.name}
                className={classes.screenshotImg}
                loading="lazy"
              />
            </div>
          </a>
        </td>

        {/* Nombre del archivo */}
        <td className={classes.td}>
          <p className={classes.screenshotTitle}>{row.name}</p>
        </td>

        {/* Tamaño */}
        <td className={classes.td}>
          <span className={classes.screenshotSize}>{sizeStr}</span>
        </td>

        {/* Fecha */}
        <td className={classes.td}>
          <span className={classes.screenshotDate}>{dateStr}</span>
        </td>

        {/* Acciones */}
        <td className={classes.td}>
          <div className={classes.actionsCell}>
            <Tooltip label="Ver original" radius="sm">
              <a
                href={row.url}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.actionBtn}
                aria-label={`Ver screenshot ${row.name} original`}
              >
                <IconExternalLink size={16} />
              </a>
            </Tooltip>
            {fileId && (
              <Tooltip label="Eliminar screenshot" radius="sm">
                <button
                  className={`${classes.actionBtn} ${classes.actionBtnDelete}`}
                  onClick={() => handleOpenDelete(fileId, row.name)}
                  aria-label={`Eliminar screenshot ${row.name}`}
                >
                  <IconTrash size={16} stroke={2} />
                </button>
              </Tooltip>
            )}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className={classes.container}>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        <IKUpload
          ref={IKUploadRef}
          urlEndpoint={urlEndpoint}
          fileName={file?.name}
          folder="Flutesdog"
          onUploadProgress={(p) =>
            setProgress(Math.round((p.loaded / p.total) * 100))
          }
          onSuccess={handleOnSuccess}
          onError={() => {
            notifications.show({
              title: "Oops",
              message: "No pudimos subir la imagen.",
              color: "red",
            });
            setProgress(0);
          }}
          hidden
          accept="image/png,image/jpeg"
        />

        {/* Barra superior de búsqueda y subida */}
        <div className={classes.searchBar}>
          <TextInput
            placeholder="Buscar screenshots por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={
              <IconSearch
                style={{ width: rem(15), height: rem(15) }}
                stroke={1.5}
              />
            }
            styles={{
              root: { flex: 1 },
              input: {
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                height: "36px",
                fontFamily: "var(--font-body)",
                "&:focus": {
                  borderColor: "var(--accent)",
                },
              },
            }}
          />
          <motion.label
            className={classes.uploadButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Subir nueva screenshot"
          >
            <input
              type="file"
              accept="image/png,image/jpeg"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                if (f) {
                  setTimeout(() => {
                    if (IKUploadRef.current) {
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(f);
                      IKUploadRef.current.files = dataTransfer.files;
                      const event = new Event("change", { bubbles: true });
                      IKUploadRef.current.dispatchEvent(event);
                    }
                  }, 50);
                }
              }}
            />
            <IconPlus size={16} />
            <span>Subir Screenshot</span>
          </motion.label>
        </div>

        {/* Progreso de subida */}
        <AnimatePresence>
          {progress > 0 && (
            <motion.div
              className={classes.progressWrapper}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={classes.progressBar}>
                <motion.div
                  className={classes.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className={classes.progressLabel}>{progress}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabla de screenshots */}
        <div className={classes.tableCard}>
          <div className={classes.tableScroll}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.th} style={{ width: "80px" }}>Miniatura</th>
                  <th className={classes.th}>Nombre del archivo</th>
                  <th className={classes.th} style={{ width: "120px" }}>Tamaño</th>
                  <th className={classes.th} style={{ width: "140px" }}>Fecha Subida</th>
                  <th className={classes.th} style={{ width: "100px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className={classes.td}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--text-muted)",
                      }}
                    >
                      Cargando screenshots...
                    </td>
                  </tr>
                ) : rows.length > 0 ? (
                  rows
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className={classes.td}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--text-muted)",
                      }}
                    >
                      <IconPhoto
                        size={36}
                        stroke={1}
                        style={{ marginBottom: "8px", opacity: 0.5 }}
                      />
                      <p>No se encontraron screenshots.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </IKContext>

      {/* Modal Confirmación de Eliminación */}
      <Modal
        opened={deleteModalOpen}
        onClose={handleCloseDelete}
        title="Eliminar Screenshot"
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
        <Text size="sm" style={{ color: "var(--text-secondary)" }}>
          ¿Estás seguro de realizar esta acción con la screenshot{" "}
          <strong>{deleteFileName}</strong>? Esta acción la borrará permanentemente de ImageKit y no se podrá deshacer.
        </Text>
        <Group justify="flex-end" mt="xl">
          <Button
            onClick={handleCloseDelete}
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
            color="red"
            onClick={handleDeleteConfirm}
            loading={deleting}
            styles={{
              root: {
                backgroundColor: "#ff4a4a",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#e03e3e",
                },
              },
            }}
          >
            Eliminar
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
