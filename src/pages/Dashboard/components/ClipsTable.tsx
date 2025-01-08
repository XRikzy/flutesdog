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
  Flex,
} from "@mantine/core";
import classes from "./TableSort.module.css";
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { ClipsModalAdd } from "./ClipsModalAdd";
import { useDisclosure } from "@mantine/hooks";
import { useGetClips } from "../../../hooks/Clips/useGetClips";

export function ClipsTable() {
  const [scrolled, setScrolled] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { data, refetch } = useGetClips();
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
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ sm: "xs", md: "5px" }}
        >
          <Tooltip label="Editar">
            <ActionIcon size="lg" radius="lg">
              <IconEdit style={{ width: "70%", height: "70%" }} stroke={2} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Eliminar">
            <ActionIcon color="red" size="lg" radius="lg">
              <IconTrash style={{ width: "70%", height: "70%" }} stroke={2} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group style={{ justifyContent: "center" }}>
        <ScrollArea onScrollPositionChange={({ x }) => setScrolled(x !== 0)}>
          <Group style={{ justifyContent: "flex-end" }}>
            <TextInput
              placeholder="Busca el titulo"
              leftSection={
                <IconSearch
                  style={{ width: rem(15), height: rem(15) }}
                  stroke={1.5}
                />
              }
              flex={1}
            />
            <Tooltip label="Agregar nuevo clip">
              <ActionIcon onClick={open}>
                <IconPlus style={{ width: "70%", height: "70%" }} stroke={2} />
              </ActionIcon>
            </Tooltip>
            <ClipsModalAdd opened={opened} close={close} refetch={refetch} />
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
      </Group>
    </>
  );
}
