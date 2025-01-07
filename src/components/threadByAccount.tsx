import { getAllByAccount } from "@/features/dashboard/services/profile.services";
import { useThreadStore } from "@/hooks/store/threadStore";
import useUserStore from "@/hooks/store/userStore";
import { ThreadsType } from "@/types/thread.types";
import { getRelativeTime } from "@/utils/getRelativeTimes";
import { Box, HStack, Image, Link, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

interface ThreadByAccountProps {
  authorId: string; 
}

export default function ThreadByAccount({ authorId }: ThreadByAccountProps) {
  const [threads, setThreads] = useState<ThreadsType[]>([]);
  const navigate = useNavigate();
  const { token } = useUserStore()
  const { toggleLikeThread} = useThreadStore();

  useEffect(() => {
    if (authorId && token) {
      retrieveAllThreads();
    }
  }, [authorId, token,toggleLikeThread]);

  const retrieveAllThreads = async () => {
    try {
      if (token) {
        const threads = await getAllByAccount(authorId, token); // Kirim token ke service
        setThreads(threads);
      } else {
        console.error("Token is missing.");
      }
  
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  const handleLike = async (threadId: number) => {
    if (!token) {
      console.error("Token is null. Cannot toggle like.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/thread/like/${threadId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toggleLikeThread({
        threadId: response.data.threadId,
        liked: response.data.liked,
        likeCount: response.data.likeCount,
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };


  return (
    <Box w="full" h="fit" mt="0" p="0">
      {threads.length > 0 ? (
        threads.map((thread, index) => (
          <HStack
            key={index}
            p="3"
            borderBottomWidth="1px"
            borderColor="#3F3F3F"
            gap="4"
            display="flex"
            justifyContent="start"
            alignItems="flex-start"
            w="full"
            h="full"
          >
            <Image
              className="flex justify-start align-top"
              src={thread.author?.profile?.avatarImage || "https://bit.ly/naruto-sage"}
              boxSize="40px"
              borderRadius="full"
              fit="cover"
              alignSelf="flex-start"
            />
            <VStack align="start" gap="1" w="full">
              <HStack>
                <Text fontWeight="medium" textStyle="sm" color="white">
                  {thread.author?.username}
                </Text>
                <Text color="#909090" textStyle="xs">
                  {thread.author?.email}
                </Text>
                <Text color="#909090" textStyle="xs">
                  • {getRelativeTime(thread.createdAt)}
                </Text>
              </HStack>
              <VStack w="full" align="left">
                <Link href={`/thread/${thread.id}`}>
                  <Text fontWeight="350" style={{ fontSize: "13px", textAlign: "justify" }} color="white">
                    {thread.content}
                  </Text>
                </Link>
                {thread.image && (
                  <Link href="/DetailImage">
                    <Image src={thread.image} borderRadius="10px" w="93%" h="80%"/>
                  </Link>
                )}
              </VStack>
              <HStack gap="7" display="flex" alignItems="center">
                <HStack
                  display="flex"
                  alignItems="center"
                  onClick={() => handleLike(Number(thread?.id))}
                  cursor="pointer"
                >
                  {thread?.isLike ? (
                    <FcLike style={{ color: "white", fontSize: "17px" }} />
                  ) : (
                    <FaRegHeart style={{ color: "white", fontSize: "17px" }} />
                  )}
                  <Text fontWeight="medium" color="#909090" style={{ fontSize: "11px" }}>
                    {thread?._count?.like || 0}
                  </Text>
                </HStack>
                <HStack display="flex" alignItems="center" onClick={() => navigate(`/replies/${thread.id}`)}>
                <Link href={`/thread/${thread.id}`}>
                  <BiCommentDetail style={{ color: "white", fontSize: "17px" }} />
                  <Text fontWeight="medium" color="#909090" style={{ fontSize: "11px" }}>
                    {thread._count?.replies || 0} Comments
                  </Text>
                  </Link>
                </HStack>
              </HStack>
            </VStack>
          </HStack>
        ))
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
        >No threads found</Text>
      )}
    </Box>
  );
}