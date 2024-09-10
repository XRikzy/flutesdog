import cx from "clsx";
import { useState } from "react";
import { Table, ScrollArea, Badge } from "@mantine/core";
import classes from "./TableSort.module.css";
import { useGetClips } from "../../hooks/useGetClips";

export function ClipsTable() {
  const [scrolled, setScrolled] = useState(false);
  const { data } = useGetClips();
  const rows = data.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>
        {row.tag.map((name, index) => (
          <Badge key={index} variant="dot" color="red" style={{marginRight: "5px"}}>
            {name}
          </Badge>
        ))}
      </Table.Td>
      <Table.Td>{row.embed}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea
      h={300}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table miw={800}>
        <Table.Thead
          className={cx(classes.header, { [classes.scrolled]: scrolled })}
        >
          <Table.Tr>
            <Table.Th>Titulo</Table.Th>
            <Table.Th>Etiquetas</Table.Th>
            <Table.Th>URL embed</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
