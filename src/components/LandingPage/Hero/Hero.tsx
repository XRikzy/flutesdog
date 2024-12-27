import { Button, Container, Image, Text, Title } from "@mantine/core";
import classes from "./HeroImageRight.module.css";

export const Hero = () => {
  return (
    <div className={classes.root}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Bienvenido a los
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: "white", to: "cyan" }}
                ml={10}
              >
                perro flautas
              </Text>{" "}
            </Title>

            <Text className={classes.description} mt={30}>
              En este lugar veras los mejores momentos con mis amigos en clips y
              capturas de pantalla graciosas
            </Text>

            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
              size="xl"
              className={classes.control}
              mt={40}
            >
              Ver Clips
            </Button>
          </div>
          <Image
            className={classes.image}
            radius="xl"
            h={300}
            mt={30}
            p={10}
            w="auto"
            fit="contain"
            src="/src/assets/Hero.png"
          />
        </div>
      </Container>
    </div>
  );
};
