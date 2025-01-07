import { getAllByAccount } from "@/features/dashboard/services/profile.services";
import useUserStore from "@/hooks/store/userStore";
import { ThreadsType } from "@/types/thread.types";
import { Box, Grid, Image, Link, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface ThreadByAccountProps {
  authorId: string; // Gunakan authorId sebagai props, bukan token
}


export default function ImageByAccount({ authorId }: ThreadByAccountProps) {
  const [images, setImages] = useState<string[]>([]);
  const { token } = useUserStore()

  useEffect(() => {
    if (authorId && token) {
      fetchImages();
    }
  }, [authorId,token]);

  const fetchImages = async () => {
    try {
      if(token){
        const threads = await getAllByAccount(authorId,token); // Gunakan token yang diterima
        const threadImages = threads
          .filter((thread: ThreadsType) => thread.image) // Hanya ambil thread yang memiliki gambar
          .map((thread: ThreadsType) => thread.image!); // Ambil URL gambar
        setImages(threadImages);  
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <Box w="full" h="fit" m="0" p="2">
      {images.length > 0 ? (
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          {images.map((image, index) => (
              <Image
                src={image}
                borderRadius="5px"
                w="full"
                h="200px"
                objectFit="cover"
                alt={`User uploaded image ${index + 1}`}
              />
          ))}
        </Grid>
      ) : (
        <Text
          w="full"
          h="fit"
          mt="0"
          p="0"
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="white"
        >
          No images found
        </Text>
      )}
    </Box>
  );
}
