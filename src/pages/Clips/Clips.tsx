import { useState } from "react";
import { Container, Skeleton, SimpleGrid } from "@mantine/core";
import { IconSearch, IconPlus, IconVideoOff } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDisclosure } from "@mantine/hooks";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { ClipsModalAdd } from "../Dashboard/components";
import { VideoPlayer } from "../../components/VideoPlayer/VideoPlayer";
import classes from "./Clips.module.css";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
} as const;

export const Clips = () => {
  const { data, loading, refetch } = useGetClips();
  const [opened, { open, close }] = useDisclosure(false);
  const [clipTitle, setClipTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState("Todos");
  const [selectedOrigin, setSelectedOrigin] = useState<"all" | "native" | "youtube">("all");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extraer etiquetas únicas de los clips
  const allTags = [
    "Todos",
    ...Array.from(new Set(data.flatMap((clip) => clip.tag || []))),
  ];

  // Generar sugerencias basadas en el texto escrito
  const suggestions = clipTitle.trim()
    ? data
        .filter((clip) =>
          clip.title.toLowerCase().includes(clipTitle.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Filtrado reactivo en memoria (más rápido y sin peticiones extras)
  const displayData = data.filter((clip) => {
    // 1. Filtrar por búsqueda de texto (título o tag)
    const query = clipTitle.toLowerCase().trim();
    const matchesQuery =
      !query ||
      clip.title.toLowerCase().includes(query) ||
      (clip.tag && clip.tag.some((t) => t.toLowerCase().includes(query)));

    // 2. Filtrar por tag seleccionado
    const matchesTag =
      selectedTag === "Todos" || (clip.tag && clip.tag.includes(selectedTag));

    // 3. Filtrar por origen (ImageKit nativo vs YouTube legacy)
    const matchesOrigin =
      selectedOrigin === "all" ||
      (selectedOrigin === "native" && !!clip.videoUrl) ||
      (selectedOrigin === "youtube" && !clip.videoUrl);

    return matchesQuery && matchesTag && matchesOrigin;
  });

  return (
    <div className={classes.page}>
      {/* Top bar */}
      <div className={classes.topBar}>
        <Container size="xl">
          <div className={classes.topBarInner}>
            <div>
              <h1 className={classes.pageTitle}>Clips</h1>
              <p className={classes.pageSubtitle}>
                {data.length} clip{data.length !== 1 ? "s" : ""} en la biblioteca
              </p>
            </div>
            <div className={classes.controls}>
              {/* Search */}
              <div className={classes.searchWrapper}>
                <IconSearch size={15} className={classes.searchIcon} />
                <input
                  type="text"
                  placeholder="Buscar clip por título o tag..."
                  className={classes.searchInput}
                  value={clipTitle}
                  onChange={(e) => {
                    setClipTitle(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  aria-label="Buscar clips"
                  id="clips-search"
                />

                {/* Sugerencias de Autocompletado */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className={classes.suggestionsDropdown}>
                    {suggestions.map((sug) => (
                      <div
                        key={sug.id}
                        className={classes.suggestionItem}
                        onClick={() => {
                          setClipTitle(sug.title);
                          setShowSuggestions(false);
                        }}
                      >
                        <span className={classes.suggestionTitle}>{sug.title}</span>
                        <span
                          className={`${classes.suggestionBadge} ${
                            sug.videoUrl ? classes.sugImageKit : classes.sugYouTube
                          }`}
                        >
                          {sug.videoUrl ? "Descargable" : "YouTube"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add button */}
              <motion.button
                className={classes.addButton}
                onClick={open}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                id="clips-add-btn"
                aria-label="Agregar nuevo clip"
              >
                <IconPlus size={16} />
                <span>Nuevo clip</span>
              </motion.button>
            </div>
          </div>
        </Container>
      </div>

      {/* Filtros Bar */}
      <div className={classes.filtersBar}>
        <Container size="xl">
          <div className={classes.filtersBarInner}>
            {/* Origen Selector */}
            <div className={classes.originSelector}>
              <span className={classes.filterLabel}>Origen</span>
              <div className={classes.segmentedControl}>
                <button
                  className={`${classes.segment} ${
                    selectedOrigin === "all" ? classes.segmentActive : ""
                  }`}
                  onClick={() => setSelectedOrigin("all")}
                >
                  Todos
                </button>
                <button
                  className={`${classes.segment} ${
                    selectedOrigin === "native" ? classes.segmentActive : ""
                  }`}
                  onClick={() => setSelectedOrigin("native")}
                >
                  Descargables
                </button>
                <button
                  className={`${classes.segment} ${
                    selectedOrigin === "youtube" ? classes.segmentActive : ""
                  }`}
                  onClick={() => setSelectedOrigin("youtube")}
                >
                  YouTube
                </button>
              </div>
            </div>

            {/* Tags Pills */}
            <div className={classes.tagsSelector}>
              <span className={classes.filterLabel}>Etiquetas</span>
              <div className={classes.tagPillsWrapper}>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    className={`${classes.tagPill} ${
                      selectedTag === tag ? classes.tagPillActive : ""
                    }`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container size="xl" py="xl">
        {loading ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={280} radius="md" />
            ))}
          </SimpleGrid>
        ) : displayData.length === 0 ? (
          <motion.div
            className={classes.emptyState}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <IconVideoOff size={48} stroke={1} color="var(--text-muted)" />
            <p className={classes.emptyTitle}>No hay clips aquí</p>
            <p className={classes.emptySubtitle}>
              {clipTitle.trim() || selectedTag !== "Todos" || selectedOrigin !== "all"
                ? "Ningún clip coincide con los filtros aplicados."
                : "Aún no hay clips cargados. ¡Agrega el primero!"}
            </p>
          </motion.div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              <AnimatePresence>
                {displayData.map(({ id, title, embed, videoUrl, tag }) => (
                  <motion.article
                    key={id}
                    className={classes.card}
                    variants={cardVariants}
                    layout
                    whileHover={{ y: -4, borderColor: "var(--border-accent)" }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Video: ImageKit nativo o YouTube embed legacy */}
                    {videoUrl ? (
                      <VideoPlayer src={videoUrl} title={title} showDownload />
                    ) : (
                      <div className={classes.iframeWrapper}>
                        <iframe
                          src={embed}
                          title={title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className={classes.iframe}
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className={classes.cardBody}>
                      <p className={classes.cardTitle}>{title}</p>
                      {tag.length > 0 && (
                        <div className={classes.tagsRow}>
                          {tag.map((name, index) => (
                            <span key={index} className={classes.tag}>
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </SimpleGrid>
          </motion.div>
        )}
      </Container>

      <ClipsModalAdd opened={opened} close={close} refetch={refetch} />
    </div>
  );
};
