import { getAllThreadsByUser } from "@/features/dashboard/services/profile.services";
import { useThreadStore } from "@/hooks/store/threadStore";
import { ThreadsType } from "@/types/thread.types";
import { getRelativeTime } from "@/utils/getRelativeTimes";
import { Box, HStack, Image, Link, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import DialogEditThread from "./dialogEditThread";
import Swal from "sweetalert2";

interface ThreadByUserProps {
  token: string;
  user: {
    username: string;
    email: string;
  } | null;
}
export default function ThreadByUser({ token,user }: ThreadByUserProps) {
  const [threads, setThreads] = useState<ThreadsType[]>([]);
  const navigate = useNavigate();
  const {toggleLikeThread} = useThreadStore();

  useEffect(() => {
    if (token) {
      retrieveAllThreads();
      console.log("Threads updated:", threads);
    }
  }, [token,threads]); 

  const retrieveAllThreads = async () => {
    try {
      const threads = await getAllThreadsByUser(token); // Gunakan token yang diterima
      setThreads(threads);
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
        threadId: String(threadId),
        liked: response.data.liked,
        likeCount: response.data.likeCount,
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleDeleteThread = async (threadId: number) => {
      if (!token) {
        console.error("Token is required to delete thread.");
        return;
      }
    
      try {
        await useThreadStore.getState().deleteThread(threadId, token);
        Swal.fire({
          title: "Success",
          text: "Thread has been deleted.",
          icon: "success",
        });
      } catch (error) {
        console.error("Failed to delete thread:", error);
        Swal.fire({
          title: "Error",
          text: "There was an issue deleting the thread.",
          icon: "error",
        });
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
                    <Image src={thread.image} borderRadius="10px" w="93%" h="80%" />
                )}
              </VStack>
              <HStack gap="7" display="flex" alignItems="center">
                <HStack
                  display="flex"
                  alignItems="center"
                  onClick={() => handleLike(Number(thread.id))}
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
                {user?.username && thread.author?.username === user.username && (
                <HStack>
                  <DialogEditThread thread={thread} />
                  <HStack display="flex" alignItems="center">
                    <Text
                      fontWeight="medium"
                      color="red.500"
                      style={{ fontSize: "11px", cursor: "pointer" }}
                      onClick={() => handleDeleteThread(Number(thread.id))}
                    >
                      Delete
                    </Text>
                  </HStack>
                </HStack>
              )}
              </HStack>
            </VStack>
          </HStack>
        ))
      ) : (
        <Text color="white">No threads found</Text>
      )}
    </Box>
  );
}

// interface ThreadByUserProps {
//   token: any; // Terima token sebagai props
// }

// export default function ThreadByUser({ token }: ThreadByUserProps) {
//   const toggleLike = useLikeStore((state) => state.toggleLike);
//   const [threads, setThreads] = useState<ThreadsType[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (token) {
//       retrieveAllThreads();
//     }
//   }, [token]);

//   const retrieveAllThreads = async () => {
//     try {
//       const token = localStorage.getItem("token"); // Ambil token dari localStorage
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const threads = await getAllThreadsByUser(token); // Gunakan token untuk API
//       console.log("list all threads", threads);
//       setThreads(threads);
//     } catch (error) {
//       console.error("Error fetching threads:", error);
//     }
//   };

//   return (
//     <Box w="full" h="fit">
//       {threads.length > 0 &&
//         threads.map((thread: ThreadsType, index: number) => (
//           <HStack
//             key={index}
//             p="3"
//             borderBottomWidth="1px"
//             borderColor="#3F3F3F"
//             gap="4"
//             display="flex"
//             justifyContent="start"
//             alignItems="flex-start"
//             w="full"
//             h="full"
//           >
//               <Image
//                 className="flex justify-start align-top"
//                 src={
//                   thread.author?.profile?.avatarImage ||
//                   "https://bit.ly/naruto-sage"
//                 }
//                 boxSize="40px"
//                 borderRadius="full"
//                 fit="cover"
//                 alignSelf="flex-start"
//               />
//             <VStack align="start" gap="1">
//               <HStack>
                
//                   <Text fontWeight="medium" textStyle="sm" color="white">
//                     {thread.author?.username}
//                   </Text>
                
//                 <Text color="#909090" textStyle="xs">
//                   • {getRelativeTime(thread.createdAt)}
//                 </Text>
//               </HStack>
//               <VStack>
//                 <Link href={`/thread/${thread.id}`}>
//                   <Text
//                     fontWeight="350"
//                     style={{ fontSize: "13px", textAlign: "justify" }}
//                     color="white"
//                   >
//                     {thread.content}
//                   </Text>
//                 </Link>
//                 {thread.image && (
//                   <Link href="/DetailImage">
//                     <Image src={thread.image} borderRadius="10px" w="full" />
//                   </Link>
//                 )}
//               </VStack>
//               <HStack gap="7" display="flex" alignItems="center">
//                 <HStack
//                   display="flex"
//                   alignItems="center"
//                   onClick={() => toggleLike(index)}
//                   cursor="pointer"
//                 >
//                   {thread.isLike ? (
//                     <FcLike
//                       style={{ color: "white", fontSize: "17px" }}
//                     />
//                   ) : (
//                     <FaRegHeart
//                       style={{ color: "white", fontSize: "17px" }}
//                     />
//                   )}
//                   <Text
//                     fontWeight="medium"
//                     color="#909090"
//                     style={{ fontSize: "11px" }}
//                   >
//                     {thread._count?.like || 0}
//                   </Text>
//                 </HStack>
//                 <HStack
//                   display="flex"
//                   alignItems="center"
//                   onClick={() => navigate(`/replies/${thread.id}`)}
//                 >
//                   <BiCommentDetail
//                     style={{ color: "white", fontSize: "17px" }}
//                   />
//                   <Text
//                     fontWeight="medium"
//                     color="#909090"
//                     style={{ fontSize: "11px" }}
//                   >
//                     {thread._count?.replies || 0} Comments
//                   </Text>
//                 </HStack>
//                 <HStack display="flex" alignItems="center">
//                   <Text
//                     fontWeight="medium"
//                     color="#909090"
//                     style={{ fontSize: "11px" }}
//                   >
//                     Edit
//                   </Text>
//                   <Text
//                     fontWeight="medium"
//                     color="#909090"
//                     style={{ fontSize: "11px" }}
//                   >
//                     Delete
//                   </Text>
//                 </HStack>
//               </HStack>
//             </VStack>
//           </HStack>
//         ))}
//     </Box>
//   );
// }



