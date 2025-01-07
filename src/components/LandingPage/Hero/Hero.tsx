import { Button, Image, Text, Title } from "@mantine/core";
import classes from "./HeroImageRight.module.css";
export const Hero = () => {
  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Bienvenido a los
            <Text
              inherit
              component="span"
              variant="gradient"
              gradient={{ from: "white", to: "cyan" }}
              ml={10}
            >
              perro flautas
            </Text>{" "}
          </Title>
          <Text className={classes.description} mt={20}>
            Mas que amistades de internet una familia donde todos se burlan de
            jose
          </Text>
          <Button
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            size="xl"
            className={classes.control}
            mt={40}
          >
            Ver clips
          </Button>
        </div>
        <Image
          visibleFrom="sm"
          radius="xl"
          h={300}
          mt={30}
          p={10}
          w="auto"
          fit="contain"
          src="/assets/hero.png"
          alt="minecraft_pic"
        />
      </div>
    </div>
  );
};
