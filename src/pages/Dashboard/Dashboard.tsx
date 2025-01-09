import { useState } from "react";
import { Box, Container, Flex, Text } from "@mantine/core";
import { IconClipboard, IconAward, IconScreenshot } from "@tabler/icons-react";
import classes from "./css/NavbarSimple.module.css";
import { useGetClips } from "../../hooks/Clips/useGetClips";
import { Loading } from "../../components/Loading";
import { ClipsTable } from "./components/ClipsTable";
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
        <Container size="lg">
          <Flex
            direction={{ base: "column", sm: "column", md: "row", xl: "row" }}
            gap={{ base: "sm", sm: "lg" }}
            justify={{ sm: "center" }}
            
          >
            <Box
              bg="#2e2e2e"
              my="lg"
              style={{ borderRadius: 15 }}
              className={classes.navbar}
            >
              <Text p={2} ml={3} mt={1} mb={12}>
                Contenido
              </Text>
              {links}
            </Box>
            <ClipsTable />
          </Flex>
        </Container>
      )}
    </>
  );
}
