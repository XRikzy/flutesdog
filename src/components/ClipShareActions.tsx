import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLink } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export function ClipShareActions({ id, showDetailsLink = true }: { id: string; showDetailsLink?: boolean }) {
  const path = `/clips/${encodeURIComponent(id)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(path, window.location.origin).href);
      notifications.show({ message: "Enlace del clip copiado." });
    } catch {
      notifications.show({ message: "Abre el clip y copia la URL desde el navegador.", color: "red" });
    }
  };

  return (
    <Group gap="xs" mt="sm">
      {showDetailsLink && (
        <Button component={Link} to={path} variant="light" size="xs">
          Abrir clip
        </Button>
      )}
      <Button variant="subtle" size="xs" leftSection={<IconLink size={16} />} onClick={copyLink}>
        Copiar enlace
      </Button>
    </Group>
  );
}
