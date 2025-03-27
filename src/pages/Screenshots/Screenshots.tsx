import {
  Blockquote,
  Button,
  Container,
  FileButton,
  Group,
  Image,
  Progress,
  SimpleGrid,
} from "@mantine/core";
import { IKContext, IKUpload } from "imagekitio-react";
import { Loading } from "../../components/Loading";
import { useAddScreenshot } from "./hook/useAddScreenshot";
import { IconInfoCircle, IconPlus } from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";
import { notifications } from "@mantine/notifications";

export const Screenshots = () => {
  const {
    authenticator,
    images,
    loading,
    publicKey,
    urlEndpoint,
    fetchImages,
  } = useAddScreenshot();
  const IKUploadRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const handleOnSucces = useCallback(() => {
    try {
      fetchImages();
      notifications.show({
        title: "Agregado!",
        message: "Una nuevo screenshot se ha agregado a la pagina!!",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      console.error("Ha ocurrido un error");
    }
  }, [fetchImages]);
  return (
    <div>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        <IKUpload
          ref={IKUploadRef}
          urlEndpoint={urlEndpoint}
          fileName={file?.name}
          folder="Flutesdog"
          onUploadProgress={(progress) => {
            const pogressPercent =
              Math.round(progress.loaded / progress.total) * 100;
            setProgress(pogressPercent);
          }}
          onSuccess={handleOnSucces}
          onError={() =>
            notifications.show({
              title: "Oops paso algo",
              message: "Parece que no pudimos subir tu imagen :c",
            })
          }
          hidden
        />
        <Container size="lg" p={{ base: "sm", sm: "md" }}>
          <Blockquote
            color="red"
            cite="– Ricardo"
            icon={<IconInfoCircle />}
            mt="xl"
            mb="xl"
          >
            Por favor no suban nada cuestionable :c
          </Blockquote>
          <Group justify="right" pb={10} mb={5}>
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => (
                <Button
                  {...props}
                  onClick={() => IKUploadRef.current?.click()}
                  leftSection={<IconPlus size={14} />}
                  radius={"lg"}
                >
                  Nueva Screenshot
                </Button>
              )}
            </FileButton>
          </Group>
          {progress > 0 && (
            <div style={{ marginTop: 10 }}>
              <Progress value={progress} />
            </div>
          )}

          {loading ? (
            <Loading />
          ) : (
            <>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {images.map(({ fileId, url, name }) => (
                  <Image
                    key={fileId}
                    src={url}
                    alt={name}
                    style={{ height: 700 }}
                    radius={5}
                  />
                ))}
              </SimpleGrid>
            </>
          )}
        </Container>
      </IKContext>
    </div>
  );
};
