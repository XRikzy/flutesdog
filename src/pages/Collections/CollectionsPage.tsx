import { Alert, Anchor, Badge, Card, Container, Group, Image, SimpleGrid, Skeleton, Stack, Text, Title } from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import { useCollections } from "../../hooks/useCollections";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { useAddScreenshot } from "../Screenshots/hook/useAddScreenshot";
import { getClipThumbnail } from "../../utils/clipThumbnail";
import type { MediaCollection } from "../../services/collections";

export function CollectionCard({ item, featured }: { item: MediaCollection; featured?: boolean }) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="xs">
        {featured && <Badge variant="light">Destacada</Badge>}
        <Title order={3}><Anchor component={Link} to={`/colecciones/${encodeURIComponent(item.id)}`}>{item.title}</Anchor></Title>
        {item.description && <Text>{item.description}</Text>}
        <Text size="sm" c="dimmed">{item.clipIds.length} clips · {item.screenshotIds.length} capturas</Text>
      </Stack>
    </Card>
  );
}

function CollectionMedia({ item }: { item: MediaCollection }) {
  const { data: clips, loading: loadingClips, error } = useGetClips();
  const { images, loading: loadingImages } = useAddScreenshot();
  const clipsById = new Map(clips.map((clip) => [clip.id, clip]));
  const imagesById = new Map(images.map((image) => [image.fileId, image]));
  const selectedClips = item.clipIds.flatMap((id) => clipsById.get(id) ?? []);
  const selectedImages = item.screenshotIds.flatMap((id) => {
    const image = imagesById.get(id);
    return image?.url ? [image] : [];
  });

  return (
    <>
      {error && <Alert color="red">{error}</Alert>}
      {loadingClips || loadingImages ? <Skeleton height={180} /> : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {selectedClips.map((clip) => (
            <Card key={clip.id} withBorder radius="md">
              <Card.Section>
                <Link to={`/clips/${encodeURIComponent(clip.id)}`} aria-label={`Abrir clip ${clip.title}`}>
                  <Image src={getClipThumbnail(clip) || "/assets/hero.png"} fallbackSrc="/assets/hero.png" h={180} loading="lazy" alt="" />
                </Link>
              </Card.Section>
              <Group mt="sm">
                <Anchor component={Link} to={`/clips/${encodeURIComponent(clip.id)}`}>{clip.title || "Clip"}</Anchor>
                <Badge variant="light">Clip</Badge>
              </Group>
            </Card>
          ))}
          {selectedImages.map((image) => (
            <Card key={image.fileId} withBorder radius="md">
              <Card.Section>
                <a href={image.url} target="_blank" rel="noreferrer">
                  <Image src={image.thumbnail || image.url} h={180} loading="lazy" alt={image.name} />
                </a>
              </Card.Section>
              <Group mt="sm"><Text>{image.name}</Text><Badge variant="light">Captura</Badge></Group>
            </Card>
          ))}
        </SimpleGrid>
      )}
      {!loadingClips && !loadingImages && !error && selectedClips.length + selectedImages.length === 0 && (
        <Text c="dimmed">Esta colección todavía no tiene contenido disponible.</Text>
      )}
    </>
  );
}

export function CollectionsPage() {
  const { collectionId } = useParams();
  const { data, loading, error, reload } = useCollections();
  const item = data?.items.find((entry) => entry.id === collectionId);
  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {collectionId && <Anchor component={Link} to="/colecciones">Volver a colecciones</Anchor>}
        <Title order={1}>{item?.title || "Colecciones"}</Title>
        {loading ? <Skeleton height={180} /> : error ? (
          <Alert color="red">No pudimos cargar las colecciones. <Anchor component="button" onClick={reload}>Reintentar</Anchor></Alert>
        ) : collectionId ? item ? (
          <>
            {item.description && <Text>{item.description}</Text>}
            <CollectionMedia item={item} />
          </>
        ) : <Text>Colección no encontrada.</Text> : data?.items.length ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {data.items.map((entry) => <CollectionCard key={entry.id} item={entry} featured={entry.id === data.featuredId} />)}
          </SimpleGrid>
        ) : <Text c="dimmed">Todavía no hay colecciones publicadas.</Text>}
      </Stack>
    </Container>
  );
}
