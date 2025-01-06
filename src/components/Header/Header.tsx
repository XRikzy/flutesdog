import { ActionIcon, Burger, Group, Title } from "@mantine/core";
import { NavBar } from "../Navegation/NavBar";
import { IconBrandTiktok } from "@tabler/icons-react";
type HeaderProps = {
  opened: boolean;
  toggle: () => void;
};
export const Header = ({ opened, toggle }: HeaderProps) => {
  return (
    <Group h="100%" px="xl" m="0">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Title order={3}>Perro Flautas</Title>
      <Group
        gap={2}
        visibleFrom="sm"
        style={{ fontSize: 18, fontWeight: 500, flex: 1 }}
        justify="center"
      >
        <NavBar />
      </Group>
      <Group justify="flex-end">
        <ActionIcon
          variant="subtle"
          aria-label="Tik tok"
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
