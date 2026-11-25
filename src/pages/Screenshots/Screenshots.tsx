import { useRef, useState } from "react";
import { FileButton, Select } from "@mantine/core";
import { IconAlertTriangle, IconArrowsSort, IconPlus, IconSearch } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAddScreenshot } from "./hook/useAddScreenshot";
import { LibraryPage } from "../../components/LibraryPage";
import library from "../../components/LibraryPage.module.css";
import classes from "./Screenshots.module.css";
import { ScreenshotGallery } from "./ScreenshotGallery";

const dateOptions = [
  { value: "all", label: "Todas" },
  { value: "today", label: "Hoy" },
  { value: "week", label: "Últimos 7 días" },
  { value: "month", label: "Último mes" },
] as const;

const sortOptions = [
  { value: "recent", label: "Más recientes" },
  { value: "oldest", label: "Más antiguas" },
  { value: "name", label: "Nombre (A–Z)" },
  { value: "size", label: "Tamaño" },
] as const;

export const Screenshots = () => {
  const { images, loading, addScreenshot, uploading, progress } = useAddScreenshot();
  const { user, loading: authLoading } = useAuth();
  const { openAccount } = useOutletContext<{ openAccount: () => void }>();
  const resetUpload = useRef<() => void>(null);

  // Filtros y ordenamiento
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<(typeof dateOptions)[number]["value"]>("all");
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>("recent");

  // 1. Filtrado de imágenes en memoria
  const filteredImages = images.filter((img) => {
    // Filtrar por nombre
    const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    if (!matchesSearch) return false;

    // Filtrar por fecha
    if (dateFilter === "all") return true;

    const createdAtDate = new Date(img.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAtDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (dateFilter === "today") {
      return (
        createdAtDate.getDate() === now.getDate() &&
        createdAtDate.getMonth() === now.getMonth() &&
        createdAtDate.getFullYear() === now.getFullYear()
      );
    } else if (dateFilter === "week") {
      return diffDays <= 7;
    } else if (dateFilter === "month") {
      return diffDays <= 30;
    }

    return true;
  });

  // 2. Ordenado de imágenes
  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "size") {
      return (b.size || 0) - (a.size || 0);
    }
    return 0;
  });

  return (
    <LibraryPage
      title="Screenshots"
      summary={loading ? "Cargando capturas…" : `${sortedImages.length} de ${images.length} capturas`}
      actions={
        <>
          <div className={library.search}>
            <IconSearch size={16} className={library.searchIcon} aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar por nombre"
              className={library.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar screenshots"
              id="screenshots-search"
            />
          </div>
          {user ? (
            <FileButton accept="image/png,image/jpeg" resetRef={resetUpload} disabled={uploading}
              onChange={(file) => {
                resetUpload.current?.();
                if (file) void addScreenshot(file);
              }}>
              {(props) => (
                <button {...props} type="button" className={library.primary} id="screenshots-upload-btn" disabled={uploading}>
                  <IconPlus size={17} aria-hidden="true" />
                  Subir captura
                </button>
              )}
            </FileButton>
          ) : !authLoading && (
            <button type="button" onClick={openAccount} aria-haspopup="dialog" className={library.primary}>
              Inicia sesión para subir
            </button>
          )}
        </>
      }
      filters={
        <>
          <fieldset className={library.filterGroup}>
            <legend className={library.filterLabel}>Fecha</legend>
            <div className={library.segments}>
              {dateOptions.map(({ value, label }) => (
                <button key={value} type="button" className={library.segment}
                  aria-pressed={dateFilter === value} onClick={() => setDateFilter(value)}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <Select
            className={library.select}
            classNames={{ label: library.filterLabel, input: library.selectInput, dropdown: library.selectDropdown }}
            label="Ordenar por"
            data={[...sortOptions]}
            value={sortBy}
            onChange={(value) => setSortBy(sortOptions.find((option) => option.value === value)?.value ?? "recent")}
            allowDeselect={false}
            leftSection={<IconArrowsSort size={17} aria-hidden="true" />}
          />
          <p className={classes.uploadNote}>
            <IconAlertTriangle size={16} aria-hidden="true" />
            Por favor, evita subir contenido inapropiado.
          </p>
        </>
      }
      feedback={
        <AnimatePresence>
          {uploading && (
            <motion.div
              className={classes.progressWrapper}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={classes.progressBar} role="progressbar" aria-label="Subiendo captura" aria-valuenow={progress}>
                <motion.div
                  className={classes.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className={classes.progressLabel}>{progress}%</span>
            </motion.div>
          )}
        </AnimatePresence>
      }
    >
      <ScreenshotGallery images={sortedImages} loading={loading}
        emptyTitle={images.length ? "No encontramos capturas" : "Aún no hay capturas"}
        emptyMessage={images.length ? undefined : "Las capturas que se suban aparecerán aquí."} />
    </LibraryPage>
  );
};
