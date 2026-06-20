import { useState } from "react";
import {
  Tooltip,
  TextInput,
  rem,
} from "@mantine/core";
import {
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
  IconPlayerPlay,
  IconVideo,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useGetClips } from "../../../hooks/Clips/useGetClips";
import { useDeleteClips } from "../../../hooks/Clips/useDeleteClips";
import { ClipsModalAdd } from "./Modals/ClipsModalAdd";
import { ClipsModalDelete } from "./Modals/ClipsModalDelete";
import { ClipModalEdit } from "./Modals/ClipModalEdit";
import { EditVideos } from "../../../constants/documents";
import classes from "./ClipsTable.module.css";

function getYoutubeThumbnail(embedUrl: string): string {
  if (!embedUrl) return "";
  const match = embedUrl.match(/(?:embed\/|v=)([^&?/]+)/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return "";
}

function getImageKitPoster(videoUrl: string): string {
  if (!videoUrl) return "";
  const cleanUrl = videoUrl.replace(/\.[^.]+$/, ".jpg");
  const endpoint = "https://ik.imagekit.io/ru9ftzizk/";
  if (cleanUrl.includes(endpoint)) {
    return cleanUrl.replace(endpoint, `${endpoint}tr:so-2,w-240/`);
  }
  return cleanUrl;
}

export function ClipsTable() {
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const { data, refetch } = useGetClips();
  const [searchQuery, setSearchQuery] = useState("");

  // Control de eliminación
  const {
    handleOpenDelete,
    handleCloseDelete,
    setId,
    setTitle,
    title,
    id,
    openDelete,
  } = useDeleteClips();

  // Control de edición
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState<EditVideos | undefined>();

  const handleOpenEdit = (clip: EditVideos) => {
    setEditData(clip);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditData(undefined);
  };

  const filteredData = data.filter((clip) =>
    clip.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rows = filteredData.map((row) => {
    const isImageKit = !!row.videoUrl;
    const thumbUrl = row.videoUrl
      ? getImageKitPoster(row.videoUrl)
      : getYoutubeThumbnail(row.embed || "");
    const videoLink = row.videoUrl || row.embed || "#";

    return (
      <tr key={row.id} className={classes.tr}>
        {/* Thumbnail Preview */}
        <td className={classes.td}>
          <a href={videoLink} target="_blank" rel="noopener noreferrer">
            {thumbUrl ? (
              <div className={classes.thumbnailWrapper}>
                <img
                  src={thumbUrl}
                  alt={row.title}
                  className={classes.thumbnailImg}
                  loading="lazy"
                />
                <div className={classes.thumbnailPlayBadge}>
                  <IconPlayerPlay size={16} fill="currentColor" />
                </div>
              </div>
            ) : (
              <div className={classes.noThumbnail}>
                <IconPlayerPlay size={20} />
              </div>
            )}
          </a>
        </td>

        {/* Título & Fecha */}
        <td className={classes.td}>
          <p className={classes.clipTitle}>{row.title}</p>
          {row.createdAt && (
            <span className={classes.clipDate}>
              Subido el {new Date(row.createdAt).toLocaleDateString()}
            </span>
          )}
        </td>

        {/* Tipo de video */}
        <td className={classes.td}>
          <span
            className={`${classes.typeBadge} ${
              isImageKit ? classes.typeImageKit : classes.typeYouTube
            }`}
          >
            {isImageKit ? "ImageKit" : "YouTube"}
          </span>
        </td>

        {/* Etiquetas */}
        <td className={classes.td}>
          <div className={classes.badgesContainer}>
            {row.tag.map((name, index) => (
              <span key={index} className={classes.tagBadge}>
                {name}
              </span>
            ))}
          </div>
        </td>

        {/* Acciones */}
        <td className={classes.td}>
          <div className={classes.actionsCell}>
            <Tooltip label="Editar clip" radius="sm">
              <button
                className={classes.actionBtn}
                onClick={() => handleOpenEdit(row)}
                aria-label={`Editar clip ${row.title}`}
              >
                <IconEdit size={16} stroke={2} />
              </button>
            </Tooltip>
            <Tooltip label="Eliminar clip" radius="sm">
              <button
                className={`${classes.actionBtn} ${classes.actionBtnDelete}`}
                onClick={() => {
                  handleOpenDelete();
                  setId(row.id);
                  setTitle(row.title);
                }}
                aria-label={`Eliminar clip ${row.title}`}
              >
                <IconTrash size={16} stroke={2} />
              </button>
            </Tooltip>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className={classes.container}>
      {/* Barra de búsqueda y botón agregar */}
      <div className={classes.searchBar}>
        <TextInput
          placeholder="Buscar clips por título..."
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
        <button
          className={classes.addButton}
          onClick={openAdd}
          title="Agregar nuevo clip"
        >
          <IconPlus size={16} />
          <span>Agregar Clip</span>
        </button>
      </div>

      {/* Tabla Premium */}
      <div className={classes.tableCard}>
        <div className={classes.tableScroll}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.th} style={{ width: "140px" }}>Miniatura</th>
                <th className={classes.th}>Título</th>
                <th className={classes.th} style={{ width: "120px" }}>Origen</th>
                <th className={classes.th}>Etiquetas</th>
                <th className={classes.th} style={{ width: "100px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
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
                    <IconVideo
                      size={36}
                      stroke={1}
                      style={{ marginBottom: "8px", opacity: 0.5 }}
                    />
                    <p>No se encontraron clips que coincidan con la búsqueda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ClipsModalAdd opened={openedAdd} close={closeAdd} refetch={refetch} />
      <ClipsModalDelete
        opened={openDelete}
        close={handleCloseDelete}
        refetch={refetch}
        id={id}
        title={title}
      />
      {editData && (
        <ClipModalEdit
          opened={openEdit}
          close={handleCloseEdit}
          refetch={refetch}
          data={editData}
        />
      )}
    </div>
  );
}
