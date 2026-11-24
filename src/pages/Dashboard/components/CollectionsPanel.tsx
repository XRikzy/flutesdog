import { useState } from "react";
import { ActionIcon, Alert, Badge, Button, Card, Group, Menu, Modal, SimpleGrid, Skeleton, Stack, Text, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDots, IconExternalLink, IconPencil, IconPlus, IconSearch, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useCollections } from "../../../hooks/useCollections";
import { deleteCollection, setFeaturedCollection, type MediaCollection } from "../../../services/collections";
import { CollectionCover, collectionCoverSources } from "../../Collections/CollectionCover";
import { CollectionEditor } from "../../Collections/CollectionEditor";
import { useAddScreenshot } from "../../Screenshots/hook/useAddScreenshot";
import classes from "./CollectionsPanel.module.css";

export function CollectionsPanel() {
  const { data, loading, error, reload } = useCollections();
  const { images } = useAddScreenshot();
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<{ item?: MediaCollection } | null>(null);
  const [toDelete, setToDelete] = useState<MediaCollection | null>(null);
  const [saving, setSaving] = useState(false);
  const [mutation, setMutation] = useState<{ id: string; kind: "feature" | "delete" } | null>(null);
  const items = data?.items ?? [];
  const featuredId = data?.featuredId;
  const search = query.trim().toLocaleLowerCase("es");
  const filtered = items
    .filter((item) => !search || `${item.title} ${item.description}`.toLocaleLowerCase("es").includes(search))
    .sort((a, b) => Number(b.id === featuredId) - Number(a.id === featuredId));

  const changeFeatured = async (item: MediaCollection) => {
    if (mutation) return;
    const featured = item.id !== featuredId;
    setMutation({ id: item.id, kind: "feature" });
    try {
      await setFeaturedCollection(item.id, featured);
      await reload();
      notifications.show({ message: featured ? "Colección destacada en Inicio." : "Colección retirada de Inicio." });
    } catch {
      notifications.show({ color: "red", message: "No pudimos cambiar la colección destacada." });
    } finally {
      setMutation(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete || mutation) return;
    setMutation({ id: toDelete.id, kind: "delete" });
    try {
      await deleteCollection(toDelete.id);
      await reload();
      setToDelete(null);
      notifications.show({ message: "Colección eliminada." });
    } catch {
      notifications.show({ color: "red", message: "No pudimos eliminar la colección. Intenta de nuevo." });
    } finally {
      setMutation(null);
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2}>Colecciones</Title>
          {data && <Text size="sm" c="dimmed">{items.length} {items.length === 1 ? "colección" : "colecciones"}</Text>}
        </div>
        <Button leftSection={<IconPlus size={17} />} onClick={() => setEditor({})}>Nueva colección</Button>
      </Group>

      {items.length > 0 && (
        <TextInput value={query} onChange={(event) => setQuery(event.currentTarget.value)}
          leftSection={<IconSearch size={17} />} placeholder="Buscar colecciones" aria-label="Buscar colecciones" />
      )}

      {error && <Alert color="red">
        No pudimos actualizar la lista. <Button size="compact-xs" variant="subtle" onClick={reload}>Reintentar</Button>
      </Alert>}
      {loading ? <Skeleton h={210} /> : filtered.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="md">
          {filtered.map((item) => {
            const featured = item.id === featuredId;
            const publicPath = `/colecciones/${encodeURIComponent(item.id)}`;
            return (
              <Card key={item.id} withBorder radius="md" className={classes.card} data-featured={featured || undefined}>
                <Card.Section className={classes.cover}>
                  <CollectionCover sources={collectionCoverSources(item, images)} />
                  {featured && <Badge className={classes.badge} leftSection={<IconStarFilled size={12} />}>Destacada</Badge>}
                  <ActionIcon className={classes.coverEdit} variant="filled" color="dark" size="lg"
                    onClick={() => setEditor({ item })} aria-label={`Editar portada de ${item.title}`}>
                    <IconPencil size={17} />
                  </ActionIcon>
                </Card.Section>
                <Stack gap="sm" className={classes.info}>
                  <div>
                    <Title order={3} size="h5" lineClamp={2}>{item.title}</Title>
                    {item.description && <Text size="sm" c="dimmed" lineClamp={2}>{item.description}</Text>}
                    <Text size="xs" c="dimmed" mt={6}>{item.clipIds.length} clips · {item.screenshotIds.length} capturas</Text>
                  </div>
                  <Group gap={6} className={classes.actions}>
                    <Button variant="light" size="compact-sm" leftSection={<IconPencil size={15} />}
                      onClick={() => setEditor({ item })}>Editar</Button>
                    <Button size="compact-sm" variant={featured ? "light" : "subtle"} color={featured ? "yellow" : "blue"}
                      aria-pressed={featured} leftSection={featured ? <IconStarFilled size={15} /> : <IconStar size={15} />}
                      loading={mutation?.kind === "feature" && mutation.id === item.id} disabled={Boolean(mutation)}
                      onClick={() => void changeFeatured(item)}>{featured ? "Quitar destacado" : "Destacar"}</Button>
                    <Menu position="bottom-end" shadow="md" withinPortal>
                      <Menu.Target>
                        <ActionIcon variant="subtle" aria-label={`Más acciones de ${item.title}`}>
                          <IconDots size={20} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item component={Link} to={publicPath} leftSection={<IconExternalLink size={17} />}>Ver colección</Menu.Item>
                        <Menu.Item color="red" disabled={Boolean(mutation)} leftSection={<IconTrash size={17} />}
                          onClick={() => setToDelete(item)}>Eliminar colección</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      ) : !error && (
        <Text c="dimmed">{search ? "Ninguna colección coincide con la búsqueda." : "Todavía no hay colecciones publicadas."}</Text>
      )}

      <Modal opened={Boolean(editor)} title={editor?.item ? `Editar ${editor.item.title}` : "Nueva colección"}
        size="xl" onClose={() => { if (!saving) setEditor(null); }}
        closeOnClickOutside={!saving} closeOnEscape={!saving} withCloseButton={!saving}>
        {editor && <CollectionEditor key={editor.item?.id || "new"} item={editor.item} onBusyChange={setSaving}
          onSaved={() => {
            void reload();
            setEditor(null);
            notifications.show({ message: "Colección guardada." });
          }} />}
      </Modal>

      <Modal opened={Boolean(toDelete)} title="Eliminar colección" centered
        onClose={() => { if (!mutation) setToDelete(null); }}
        closeOnClickOutside={!mutation} closeOnEscape={!mutation} withCloseButton={!mutation}>
        <Stack>
          <Text>Se eliminará <strong>{toDelete?.title}</strong> de la biblioteca. Los clips y las capturas seguirán disponibles.</Text>
          <Group justify="flex-end">
            <Button variant="default" disabled={Boolean(mutation)} onClick={() => setToDelete(null)}>Cancelar</Button>
            <Button color="red" loading={mutation?.kind === "delete"} onClick={() => void confirmDelete()}>Eliminar colección</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
