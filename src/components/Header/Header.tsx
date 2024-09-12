import { ActionIcon, Burger, Group, Title } from "@mantine/core";
import { NavBar } from "../Navegation/NavBar";
import { IconBrandTiktok } from "@tabler/icons-react";
import classes from "./header.module.css";
type HeaderProps = {
  opened: boolean;
  toggle: () => void;
};
export const Header = ({ opened, toggle }: HeaderProps) => {
  return (
    <Group h="100%" px="xl">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Title order={3}>Perro Flautas</Title>
      <Group justify="center" style={{ flex: 1 }}>
        <Group gap={2} visibleFrom="sm">
          <NavBar />
        </Group>
      </Group>
      <Group justify="flex-end">
        <ActionIcon
          variant="subtle"
          aria-label="Tik tok"
          className={classes.control}
          component="a"
          href="https://www.tiktok.com/@all4nb?_t=8kIM1a3KEEQ&_r=1"
          size="md"
          target="_blank"
        >
          <IconBrandTiktok
            style={{ width: "90%", height: "90%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Group>
    </Group>
  );
};
