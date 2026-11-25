import { useEffect, useState } from "react";
import { Button, Container, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { ClipShareActions } from "../../components/ClipShareActions";
import type { Ivideos } from "../../constants/documents";
import { getClipById } from "../../services/getClips";
import { ClipPlayback } from "./ClipPlayback";
import classes from "./Clips.module.css";
import library from "../../components/LibraryPage.module.css";

export function ClipDetail() {
  const { clipId = "" } = useParams();
  const [clip, setClip] = useState<Ivideos | null>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    getClipById(clipId).then(
      (result) => { if (active) setClip(result); },
      () => { if (active) setFailed(true); },
    );
    return () => { active = false; };
  }, [clipId]);

  useEffect(() => {
    if (!clip) return;
    const previousTitle = document.title;
    document.title = `${clip.title || "Clip"} | Perro Flautas`;
    return () => { document.title = previousTitle; };
  }, [clip]);

  return (
    <Container size="md" py="xl">
      <Stack gap="md" align="stretch">
        <div>
          <Button component={Link} to="/clips" variant="subtle" leftSection={<IconArrowLeft size={16} />}>
            Volver a clips
          </Button>
        </div>
        {failed ? (
          <Text role="alert">No pudimos cargar el clip. Intenta recargar la página.</Text>
        ) : clip === undefined ? (
          <Skeleton aria-label="Cargando clip" style={{ aspectRatio: "16 / 9" }} radius="md" />
        ) : clip === null ? (
          <Title order={1} className={library.title}>Clip no encontrado</Title>
        ) : (
          <>
            <Title order={1} className={library.title}>{clip.title || "Clip"}</Title>
            <div className={library.card}>
              <ClipPlayback {...clip} />
              <div className={library.cardBody}>
                {clip.tag.length > 0 && (
                  <div className={classes.tagsRow}>
                    {clip.tag.map((tag, index) => <span className={classes.tag} key={index}>{tag}</span>)}
                  </div>
                )}
                <ClipShareActions id={clip.id} showDetailsLink={false} />
              </div>
            </div>
          </>
        )}
      </Stack>
    </Container>
  );
}
