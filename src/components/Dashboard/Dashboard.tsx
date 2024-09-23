import { useState } from "react";
import { Box, Flex, Text } from "@mantine/core";
import { IconClipboard, IconAward, IconScreenshot } from "@tabler/icons-react";
import classes from "./css/NavbarSimple.module.css";
import { ClipsTable } from "./clips/ClipsTable";
import { Loading } from "../Loading";
import { useGetClips } from "../../hooks/Clips/useGetClips";

const data = [
  { id: "clips", link: "", label: "Clips", icon: IconClipboard },
  { id: "awards", link: "", label: "Awards", icon: IconAward },
  { id: "screenshots", link: "", label: "Screenshots", icon: IconScreenshot },
];

export function Dashboard() {
  const [active, setActive] = useState("Billing");
  const { loading } = useGetClips();
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ sm: "lg" }}
          justify={{ sm: "center" }}
          p={10}
        >
          <Box
            bg="#2e2e2e"
            my="xl"
            style={{ borderRadius: 20 }}
            h={200}
            w={200}
          >
            <Text p={10} ml={2} mt={3}>
              Contenido
            </Text>
            {links}
          </Box>
          <ClipsTable />
        </Flex>
      )}
    </>
  );
}
