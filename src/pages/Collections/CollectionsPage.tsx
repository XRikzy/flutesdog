import { useState } from "react";
import { Alert, Anchor, Badge, Button, Container, Group, Modal, SimpleGrid, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCollections } from "../../hooks/useCollections";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { ClipsGrid } from "../Clips/ClipsGrid";
import { ScreenshotGallery } from "../Screenshots/ScreenshotGallery";
import { useAddScreenshot } from "../Screenshots/hook/useAddScreenshot";
import type { Images } from "../Screenshots/decorators/UImages";
import type { MediaCollection } from "../../services/collections";
import { CollectionCover, collectionCoverSources } from "./CollectionCover";
import { CollectionEditor } from "./CollectionEditor";
import classes from "./Collections.module.css";

export function CollectionCard({ item, featured, images }: { item: MediaCollection; featured?: boolean; images: Images[] }) {
  return (
    <Link className={classes.card} to={`/colecciones/${encodeURIComponent(item.id)}`}>
      <CollectionCover sources={collectionCoverSources(item, images)} />
      {featured && <Badge className={classes.featured}>Destacada</Badge>}
      <div className={classes.cardText}>
        <h3>{item.title}</h3>
        {item.description && <p>{item.description}</p>}
        <small>{item.clipIds.length} clips · {item.screenshotIds.length} capturas</small>
      </div>
    </Link>
  );
}

function CollectionMedia({ item, images, loadingImages }: { item: MediaCollection; images: Images[]; loadingImages: boolean }) {
  const { data: clips, loading: loadingClips, error } = useGetClips();
  const clipsById = new Map(clips.map((clip) => [clip.id, clip]));
  const imagesById = new Map(images.map((image) => [image.fileId, image]));
  const selectedClips = item.clipIds.flatMap((id) => clipsById.get(id) ?? []);
  const selectedImages = item.screenshotIds.flatMap((id) => {
    const image = imagesById.get(id);
    return image?.url ? [image] : [];
  });

  return (
    <Stack gap="xl">
      <section aria-labelledby="collection-screenshots">
        <Title order={2} id="collection-screenshots" mb="md">Capturas</Title>
        <ScreenshotGallery images={selectedImages} loading={loadingImages && item.screenshotIds.length > 0}
          emptyMessage="Esta colección todavía no tiene capturas disponibles." />
      </section>
      <section aria-labelledby="collection-clips">
        <Title order={2} id="collection-clips" mb="md">Clips</Title>
        {error ? <Alert color="red">{error}</Alert> : loadingClips && item.clipIds.length ? <Skeleton height={180} /> :
          selectedClips.length ? <ClipsGrid clips={selectedClips} /> :
            <Text c="dimmed">Esta colección todavía no tiene clips disponibles.</Text>}
      </section>
    </Stack>
  );
}

export function CollectionsPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { openAccount } = useOutletContext<{ openAccount: () => void }>();
  const { user, loading: authLoading } = useAuth();
  const { data, loading, error, reload } = useCollections();
  const { images, loading: loadingImages } = useAddScreenshot();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const item = data?.items.find((entry) => entry.id === collectionId);

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {collectionId && <Anchor component={Link} to="/colecciones">Volver a colecciones</Anchor>}
        <Group justify="space-between">
          <Title order={1}>{item?.title || "Colecciones"}</Title>
          {!collectionId && <Button leftSection={<IconPlus size={17} />} disabled={authLoading}
            onClick={() => user ? setEditing(true) : openAccount()}>Crear colección</Button>}
        </Group>
        {loading ? <Skeleton height={240} /> : error ? (
          <Alert color="red">No pudimos cargar las colecciones. <Anchor component="button" onClick={reload}>Reintentar</Anchor></Alert>
        ) : collectionId ? item ? (
          <>
            {item.description && <Text>{item.description}</Text>}
            <CollectionMedia key={item.id} item={item} images={images} loadingImages={loadingImages} />
          </>
        ) : <Text>Colección no encontrada.</Text> : data?.items.length ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {data.items.map((entry) => <CollectionCard key={entry.id} item={entry} featured={entry.id === data.featuredId} images={images} />)}
          </SimpleGrid>
        ) : <Text c="dimmed">Todavía no hay colecciones publicadas.</Text>}
      </Stack>
      <Modal opened={editing && Boolean(user) && !collectionId} onClose={() => { if (!saving) setEditing(false); }}
        title="Crear colección" size="xl" closeOnClickOutside={!saving} closeOnEscape={!saving} withCloseButton={!saving}>
        {editing && user && <CollectionEditor onBusyChange={setSaving} onSaved={(id) => {
          setEditing(false);
          reload();
          navigate(`/colecciones/${encodeURIComponent(id)}`);
        }} />}
      </Modal>
    </Container>
  );
}