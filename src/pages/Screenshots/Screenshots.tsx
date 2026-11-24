import { useState } from "react";
import { Container } from "@mantine/core";
import {
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAddScreenshot } from "./hook/useAddScreenshot";
import classes from "./Screenshots.module.css";
import { ScreenshotGallery } from "./ScreenshotGallery";

export const Screenshots = () => {
  const { images, loading, addScreenshot, uploading, progress } = useAddScreenshot();
  const { user, loading: authLoading } = useAuth();
  const { openAccount } = useOutletContext<{ openAccount: () => void }>();

  // Filtros y ordenamiento
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name" | "size">("recent");

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
    <div className={classes.page}>
      {/* Header */}
      <div className={classes.topBar}>
        <Container size="xl">
          <div className={classes.topBarInner}>
            <div>
              <h1 className={classes.pageTitle}>Screenshots</h1>
              <p className={classes.pageSubtitle}>
                {sortedImages.length} de {images.length} imagen{images.length !== 1 ? "es" : ""}
              </p>
            </div>
            <div className={classes.controls}>
              {/* Search */}
              <div className={classes.searchWrapper}>
                <IconSearch size={15} className={classes.searchIcon} />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className={classes.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Buscar screenshots"
                  id="screenshots-search"
                />
              </div>

              {/* Disclaimer */}
              <span className={classes.disclaimer}>
                ⚠️ Por favor no suban nada cuestionable
              </span>
              {/* Upload button */}
              {user ? <motion.label
                className={classes.uploadButton}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Subir nueva screenshot"
                id="screenshots-upload-btn"
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  style={{ display: "none" }}
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    e.currentTarget.value = "";
                    void addScreenshot(file);
                  }}
                />
                <IconPlus size={16} />
                <span>Nueva Screenshot</span>
              </motion.label> : !authLoading && (
                <button
                  type="button"
                  onClick={openAccount}
                  aria-haspopup="dialog"
                  className={classes.uploadButton}
                >
                  Inicia sesión para subir
                </button>
              )}
            </div>
          </div>

          {/* Upload progress */}
          <AnimatePresence>
            {uploading && (
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
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className={classes.progressLabel}>{progress}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </div>

      {/* Filtros Bar */}
      <div className={classes.filtersBar}>
        <Container size="xl">
          <div className={classes.filtersBarInner}>
            {/* Filtro de Fecha */}
            <div className={classes.filterGroup}>
              <span className={classes.filterLabel}>Fecha</span>
              <div className={classes.segmentedControl}>
                <button
                  className={`${classes.segment} ${dateFilter === "all" ? classes.segmentActive : ""}`}
                  onClick={() => setDateFilter("all")}
                >
                  Todas
                </button>
                <button
                  className={`${classes.segment} ${dateFilter === "today" ? classes.segmentActive : ""}`}
                  onClick={() => setDateFilter("today")}
                >
                  Hoy
                </button>
                <button
                  className={`${classes.segment} ${dateFilter === "week" ? classes.segmentActive : ""}`}
                  onClick={() => setDateFilter("week")}
                >
                  Últimos 7 días
                </button>
                <button
                  className={`${classes.segment} ${dateFilter === "month" ? classes.segmentActive : ""}`}
                  onClick={() => setDateFilter("month")}
                >
                  Último mes
                </button>
              </div>
            </div>

            {/* Ordenamiento */}
            <div className={classes.filterGroup}>
              <span className={classes.filterLabel}>Ordenar por</span>
              <div className={classes.segmentedControl}>
                <button
                  className={`${classes.segment} ${sortBy === "recent" ? classes.segmentActive : ""}`}
                  onClick={() => setSortBy("recent")}
                >
                  Más recientes
                </button>
                <button
                  className={`${classes.segment} ${sortBy === "oldest" ? classes.segmentActive : ""}`}
                  onClick={() => setSortBy("oldest")}
                >
                  Más antiguos
                </button>
                <button
                  className={`${classes.segment} ${sortBy === "name" ? classes.segmentActive : ""}`}
                  onClick={() => setSortBy("name")}
                >
                  Nombre (A-Z)
                </button>
                <button
                  className={`${classes.segment} ${sortBy === "size" ? classes.segmentActive : ""}`}
                  onClick={() => setSortBy("size")}
                >
                  Tamaño
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container size="xl" py="xl">
        <ScreenshotGallery images={sortedImages} loading={loading} />
      </Container>
    </div>
  );
};
