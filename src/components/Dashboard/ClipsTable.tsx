import cx from "clsx";
import { useState } from "react";
import {
  Table,
  ScrollArea,
  Badge,
  ActionIcon,
  TextInput,
  rem,
  Tooltip,
  Group,
} from "@mantine/core";
import classes from "./TableSort.module.css";
import { useGetClips } from "../../hooks/useGetClips";
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";

export function ClipsTable() {
  const [scrolled, setScrolled] = useState(false);
  const { data } = useGetClips();
  const rows = data.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>
        {row.tag.map((name, index) => (
          <Badge
            key={index}
            variant="dot"
            color="red"
            style={{ marginRight: "5px" }}
          >
            {name}
          </Badge>
        ))}
      </Table.Td>
      <Table.Td>
        <iframe
          src={row.embed}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: "0", borderRadius: "12px" }}
        />
      </Table.Td>
      <Table.Td>
        <Tooltip label="Editar">
          <ActionIcon size="lg" radius="lg">
            <IconEdit style={{ width: "70%", height: "70%" }} stroke={2} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Eliminar">
          <ActionIcon ml={8} color="red" size="lg" radius="lg">
            <IconTrash style={{ width: "70%", height: "70%" }} stroke={2} />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <ScrollArea
        h={800}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        
        <Group style={{ display: "flex", justifyContent: "flex-end" }}>
          <TextInput
            placeholder="Busca el titulo"
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            style={{ flex: 1 }}
            mr="20px"
          />
          <Tooltip label="Agregar nuevo clip">
            <ActionIcon mt="2px">
              <IconPlus style={{ width: "70%", height: "70%" }} stroke={2} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Table miw={800} verticalSpacing="lg" horizontalSpacing="sm">
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>Titulo</Table.Th>
              <Table.Th>Etiquetas</Table.Th>
              <Table.Th>Video</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
