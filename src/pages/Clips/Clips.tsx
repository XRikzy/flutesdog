import {
  AspectRatio,
  Autocomplete,
  Badge,
  Button,
  Container,
  Group,
  Rating,
  rem,
  SimpleGrid,
  Title,
} from "@mantine/core";

import { useGetClips } from "../../hooks/Clips/useGetClips";
import { Loading } from "../../components/Loading";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { ClipsModalAdd } from "../Dashboard/components";
import { useDisclosure } from "@mantine/hooks";
export const Clips = () => {
  const { data, loading } = useGetClips();
  const [opened, { open, close }] = useDisclosure(false);
  const autocomplete = data.map(({ title }) => {
    return title;
  });
  const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
  return (
    <div>
      <Container size="sm" p={{ base: "sm", sm: "md" }} mb={10}>
        <Group justify="center">
          <Autocomplete
            comboboxProps={{
              transitionProps: { transition: "fade", duration: 150 },
            }}
            data={autocomplete}
            radius="md"
            placeholder="Buscar"
            limit={5}
            rightSection={icon}
            flex={1}
          />
          <Button
            onClick={open}
            leftSection={
              <IconPlus size={14} />
            }
          >
            Nuevo clip
          </Button>
          <ClipsModalAdd opened={opened} close={close} />
        </Group>
      </Container>
      {loading ? (
        <Loading />
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing="sm"
          verticalSpacing="sm"
          px={"20px"}
          mx={"xl"}
        >
          {data.map(({ id, title, embed, tag }) => (
            <div key={id} style={{ padding: "10px" }}>
              <AspectRatio ratio={1080 / 720} mx="auto">
                <iframe
                  src={embed}
                  title="Video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: "0", borderRadius: "12px" }}
                />
              </AspectRatio>
              <div>
                <Title order={4} lineClamp={2}>
                  {title}
                </Title>
                <Group gap="xs" mt={4}>
                  <Rating defaultValue={2} fractions={2} />
                </Group>
                <Group gap="xs" mt={4}>
                  {tag.map((name, index) => (
                    <Badge key={index} variant="dot" color="red">
                      {name}
                    </Badge>
                  ))}
                </Group>
              </div>
            </div>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
};
