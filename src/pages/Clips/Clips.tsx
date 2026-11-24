import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Container, Select, Skeleton, SimpleGrid } from "@mantine/core";
import { IconSearch, IconPlus, IconVideoOff, IconPlayerPlay, IconLayoutGrid, IconDownload, IconBrandYoutube, IconTag, IconX } from "@tabler/icons-react";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { useDisclosure } from "@mantine/hooks";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { ClipsModalAdd } from "../Dashboard/components";
import { ClipShareActions } from "../../components/ClipShareActions";
import { ClipPlayback } from "./ClipPlayback";
import { getClipThumbnail } from "../../utils/clipThumbnail";
import classes from "./Clips.module.css";

const origins = [
  { value: "all", label: "Todos", icon: IconLayoutGrid },
  { value: "native", label: "Descargables", icon: IconDownload },
  { value: "youtube", label: "YouTube", icon: IconBrandYoutube },
] as const;

export const Clips = () => {
  const { data, error, loading, refetch } = useGetClips();
  const reduceMotion = useReducedMotion();
  const [resultsRef, animateResults] = useAnimate<HTMLDivElement>();
  const [showInitialSkeleton, setShowInitialSkeleton] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setShowInitialSkeleton(false), 180);
    return () => window.clearTimeout(timer);
  }, []);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { search, key: locationKey } = useLocation();
  const searchQuery = new URLSearchParams(search).get("q") ?? "";
  const [clipTitle, setClipTitle] = useState(searchQuery);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<"all" | "native" | "youtube">("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    setClipTitle(searchQuery);
    setSelectedTag(null);
    setSelectedOrigin("all");
    setShowSuggestions(false);
  }, [searchQuery, locationKey]);

  // Extraer etiquetas únicas de los clips
  const allTags = [...new Set(data.flatMap((clip) => clip.tag || []).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));

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
      selectedTag === null || (clip.tag && clip.tag.includes(selectedTag));

    // 3. Filtrar por origen (archivo de video vs YouTube legacy)
    const matchesOrigin =
      selectedOrigin === "all" ||
      (selectedOrigin === "native" && !!clip.videoUrl) ||
      (selectedOrigin === "youtube" && !clip.videoUrl);

    return matchesQuery && matchesTag && matchesOrigin;
  });
  const showResults = !loading && !showInitialSkeleton && displayData.length > 0;

  useEffect(() => {
    const results = resultsRef.current;
    if (!results || !showResults || reduceMotion) return;
    const playback = animateResults(results, { opacity: [0.62, 1], y: [5, 0] }, {
      duration: 0.22,
      ease: "easeOut",
    });
    return () => {
      playback.stop();
      results.style.removeProperty("opacity");
      results.style.removeProperty("transform");
    };
  }, [selectedOrigin, selectedTag, showResults, reduceMotion, resultsRef, animateResults]);

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

      <div className={classes.filtersBar}>
        <Container size="xl">
          <div className={classes.filtersBarInner}>
            <fieldset className={classes.originSelector}>
              <legend className={classes.filterLabel}>Origen</legend>
              <div className={classes.segmentedControl}>
                {origins.map(({ value, label, icon: Icon }) => (
                  <motion.button key={value} type="button" className={classes.segment}
                    aria-pressed={selectedOrigin === value} onClick={() => setSelectedOrigin(value)}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}>
                    {selectedOrigin === value && (
                      <motion.span
                        aria-hidden="true"
                        className={classes.segmentIndicator}
                        layoutId={reduceMotion ? undefined : "clip-origin-indicator"}
                        initial={false}
                        transition={{ type: "spring", stiffness: 465, damping: 35 }}
                      />
                    )}
                    <Icon size={16} stroke={1.75} aria-hidden="true" />
                    <span>{label}</span>
                  </motion.button>
                ))}
              </div>
            </fieldset>
            <Select
              className={classes.tagsSelector}
              classNames={{ label: classes.filterLabel, input: classes.tagInput, dropdown: classes.tagDropdown }}
              label="Etiqueta"
              placeholder="Todas las etiquetas"
              data={allTags}
              value={selectedTag}
              onChange={setSelectedTag}
              leftSection={<IconTag size={17} aria-hidden="true" />}
              searchable
              clearable
              clearButtonProps={{ "aria-label": "Quitar etiqueta" }}
              nothingFoundMessage="Ninguna etiqueta encontrada"
              maxDropdownHeight={260}
            />
            {(selectedTag !== null || selectedOrigin !== "all") && (
              <button type="button" className={classes.clearFilters} onClick={() => {
                setSelectedTag(null);
                setSelectedOrigin("all");
              }}>
                <IconX size={15} aria-hidden="true" /> Limpiar filtros
              </button>
            )}
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container size="xl" py="xl">
        {error && (
          <p role="status">
            {error} <Button variant="subtle" size="xs" onClick={refetch}>Reintentar</Button>
          </p>
        )}
        {loading || showInitialSkeleton ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" role="status" aria-label="Cargando clips">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={280} radius="md" />
            ))}
          </SimpleGrid>
        ) : displayData.length === 0 ? (error ? null : (
          <motion.div
            className={classes.emptyState}
            initial={reduceMotion ? false : { opacity: 0.62, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <IconVideoOff size={48} stroke={1} color="var(--text-muted)" />
            <p className={classes.emptyTitle}>No hay clips aquí</p>
            <p className={classes.emptySubtitle}>
              {clipTitle.trim() || selectedTag !== null || selectedOrigin !== "all"
                ? "Ningún clip coincide con los filtros aplicados."
                : "Aún no hay clips cargados. ¡Agrega el primero!"}
            </p>
          </motion.div>
        )) : (
          <div ref={resultsRef}>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {displayData.map(({ id, title, embed, videoUrl, tag, thumbnailUrl }) => {
                  const cover = getClipThumbnail({ thumbnailUrl, videoUrl, embed });
                  return (
                  <article key={id} className={classes.card}>
                    {activeClipId === id || (!videoUrl && !embed) ? (
                      <ClipPlayback title={title} videoUrl={videoUrl} embed={embed} autoPlay />
                    ) : (
                      <button type="button" className={classes.playPreview} aria-label={`Reproducir ${title}`} onClick={() => setActiveClipId(id)}>
                        {cover && <img
                          key={cover}
                          src={cover}
                          alt=""
                          loading="lazy"
                          className={classes.clipThumbnail}
                          onError={(event) => { event.currentTarget.hidden = true; }}
                        />}
                        <span className={classes.playLabel}><IconPlayerPlay size={26} aria-hidden="true" /> Reproducir</span>
                      </button>
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
                      <ClipShareActions id={id} />
                    </div>
                  </article>
                  );
                })}
            </SimpleGrid>
          </div>
        )}
      </Container>

      <ClipsModalAdd opened={opened} close={close} refetch={refetch} />
    </div>
  );
};
