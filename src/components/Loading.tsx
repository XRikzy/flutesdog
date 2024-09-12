import { Center, Loader } from "@mantine/core";

export function Loading() {
  return (
    <Center>
      <Loader color="blue" type="dots" size="lg" style={{ flex: 1 }} />
    </Center>
  );
}
