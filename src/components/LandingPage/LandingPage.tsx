import { IconCookie, IconGauge, IconUser } from "@tabler/icons-react";
import { Hero } from "./Hero/Hero";
import classes from "./LandingPage.module.css"
import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
const mockdata = [
  {
    title: "¿Qué encontrare aquí?",
    description:
      "Clips graciosos de nosotros jugando jueguitos y screenshots, imagenes graciosas o epicas a lo largo de nuestra amistad",
    icon: IconGauge,
  },
  {
    title: "¿Puedo subir clips también?",
    description:
      "Lo siento pero no amigo, es una pagina donde simplemente se puede subir clips de un solo canal de youtube",
    icon: IconUser,
  },
  {
    title: "¿Puedo comunicarme con ustedes?",
    description:
      "Depende con quien, si es con Allan, puedes hacerlo siguiendo su cuenta de TikTok, si es con los demas integrantes por ahora no",
    icon: IconCookie,
  },
];
export const LandingPage = () => {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      <feature.icon size={50} stroke={2} color={theme.colors.blue[6]} />
      <Text fz="lg" fw={500} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));
  return (
    <>
      <Hero />
      
      <Container size="lg" py="xl">
        <Group justify="center">
          <Badge variant="filled" size="lg">
            ¿Comó empezó esto?
          </Badge>
        </Group>

        <Title order={2} style={{
            base: { fontSize: "34px", fontWeight: 900 },
            sm: { fontSize: 24 },
          }}  ta="center" mt="sm">
          ¡No lo sé!
        </Title>

        <Text
          c="dimmed"
          style={{
            base: { fontSize: "34px", fontWeight: 900 },
            sm: { fontSize: 24 },
          }}
          ta="center"
          mt="md"
        >
          Simplemente un dia me dio por crear una pagina para poner clips cuando me divierto con mis amigos
        </Text>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
          {features}
        </SimpleGrid>
      </Container>
    </>
  );
};
