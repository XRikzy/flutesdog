import {
  ActionIcon,
  AspectRatio,
  Autocomplete,
  Badge,
  Button,
  Container,
  Group,
  rem,
  SimpleGrid,
  Title,
} from "@mantine/core";

import { useGetClips } from "../../hooks/Clips/useGetClips";
import { Loading } from "../../components/Loading";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { ClipsModalAdd } from "../Dashboard/components";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { getClipsByTitle } from "../../services/getClips";
import { Ivideos } from "../../constants/documents";
export const Clips = () => {
  const { data, loading, refetch } = useGetClips();
  const [opened, { open, close }] = useDisclosure(false);
  const [error, setError] = useState<string>("");
  const [filteredClip, setFilteredClip] = useState<Ivideos[] | null>(null);
  const [clipTitle, setClipTitle] = useState("");
  const autocomplete = data.map(({ title }) => {
    return title;
  });
  const handleSearchClipByTerm = async (value: string) => {
    try {
      if (!value.trim()) {
        setFilteredClip(null);
        return;
      }
      const result = await getClipsByTitle(value);
      if (!result) {
        setError("No se encontró ningún clip con ese título");
        return;
      }
      setFilteredClip(result);
      refetch();
      setError("");
    } catch {
      console.log(error);
    }
  };

  const icon = (
    <ActionIcon
      radius="lg"
      size="lg"
      variant="transparent"
      onClick={() => {
        handleSearchClipByTerm(clipTitle);
      }}
    >
      <IconSearch style={{ width: rem(16), height: rem(16) }} />
    </ActionIcon>
  );
  return (
    <div>
      <Container size="sm" p={{ base: "sm", sm: "md" }} mb={10}>
        <Group justify="center">
          <Autocomplete
            comboboxProps={{
              transitionProps: { transition: "fade", duration: 150 },
            }}
            data={autocomplete}
            radius="lg"
            placeholder="Buscar"
            limit={5}
            rightSection={icon}
            flex={1}
            onChange={(values) => setClipTitle(values)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchClipByTerm(clipTitle);
            }}
          />
          <Button
            onClick={open}
            leftSection={<IconPlus size={14} />}
            radius={"lg"}
          >
            Nuevo clip
          </Button>
          <ClipsModalAdd opened={opened} close={close} refetch={refetch} />
        </Group>
      </Container>
      {loading ? (
        <Loading />
      ) : (
        <>
          {filteredClip ? (
            <Container size="sm" p="md">
              {filteredClip.map(({ title, id, tag, embed }) => (
                <div key={id} style={{ padding: "10px" }}>
                  <AspectRatio ratio={1080 / 720} mx="auto">
                    <iframe
                      src={embed}
                      title={title}
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
                      {tag.map((name, index) => (
                        <Badge key={index} variant="dot" color="red">
                          {name}
                        </Badge>
                      ))}
                    </Group>
                  </div>
                </div>
              ))}
            </Container>
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
        </>
      )}
    </div>
  );
};
