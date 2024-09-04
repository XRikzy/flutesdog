import { AspectRatio, Badge, Group, SimpleGrid, Title } from "@mantine/core";
import { useGetClips } from "../hooks/useGetClips";
import { Loading } from "./Loading";

export const Clips = () => {
  const { documents, loading} = useGetClips();
  return (
    <div>
      <SimpleGrid
        cols={3}
        spacing="sm"
        mt="12px"
        verticalSpacing="sm"
        px={"10px"}
      >
        {loading ? (
          <Loading />
        ) : (
          documents.map(({ id, dataField }) =>
            dataField.map(({ title, embed, tag }) => (
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
            ))
          )
        )}
      </SimpleGrid>
    </div>
  );
};
