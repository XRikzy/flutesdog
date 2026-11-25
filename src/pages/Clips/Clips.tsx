import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Select, Skeleton, SimpleGrid } from "@mantine/core";
import { IconSearch, IconPlus, IconVideoOff, IconLayoutGrid, IconDownload, IconBrandYoutube, IconTag, IconX } from "@tabler/icons-react";
import { useAnimate, useReducedMotion } from "motion/react";
import { useDisclosure } from "@mantine/hooks";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { ClipsModalAdd } from "../Dashboard/components";
import { ClipsGrid } from "./ClipsGrid";
import { LibraryEmpty, LibraryPage } from "../../components/LibraryPage";
import library from "../../components/LibraryPage.module.css";
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
    <LibraryPage
      title="Clips"
      summary={loading ? "Cargando clips…" : `${displayData.length} de ${data.length} clips`}
      actions={
        <>
          <div className={library.search} onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setShowSuggestions(false);
          }} onKeyDown={(e) => {
            if (e.key === "Escape") setShowSuggestions(false);
          }}>
            <IconSearch size={16} className={library.searchIcon} aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar por título o etiqueta"
              className={library.searchInput}
              value={clipTitle}
              onChange={(e) => {
                setClipTitle(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              aria-label="Buscar clips"
              id="clips-search"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className={classes.suggestionsDropdown}>
                {suggestions.map((sug) => (
                  <button
                    key={sug.id}
                    type="button"
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
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={library.primary}
            onClick={open}
            id="clips-add-btn"
            aria-label="Agregar nuevo clip"
          >
            <IconPlus size={17} aria-hidden="true" />
            <span>Nuevo clip</span>
          </button>
        </>
      }
      filters={
        <>
          <fieldset className={library.filterGroup}>
            <legend className={library.filterLabel}>Origen</legend>
            <div className={library.segments}>
              {origins.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" className={library.segment}
                  aria-pressed={selectedOrigin === value} onClick={() => setSelectedOrigin(value)}>
                  <Icon size={16} stroke={1.75} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <Select
            className={library.select}
            classNames={{ label: library.filterLabel, input: library.selectInput, dropdown: library.selectDropdown }}
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
            <button type="button" className={library.clearFilters} onClick={() => {
              setSelectedTag(null);
              setSelectedOrigin("all");
            }}>
              <IconX size={15} aria-hidden="true" /> Limpiar filtros
            </button>
          )}
        </>
      }
    >
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
        <LibraryEmpty
          icon={<IconVideoOff size={24} stroke={1.6} />}
          title={data.length ? "No encontramos clips" : "Aún no hay clips"}
          description={clipTitle.trim() || selectedTag !== null || selectedOrigin !== "all"
            ? "Ningún clip coincide con los filtros aplicados."
            : "Los clips que se agreguen aparecerán aquí."}
        />
      )) : (
        <div ref={resultsRef}>
          <ClipsGrid clips={displayData} />
        </div>
      )}
      <ClipsModalAdd opened={opened} close={close} refetch={refetch} />
    </LibraryPage>
  );
};
