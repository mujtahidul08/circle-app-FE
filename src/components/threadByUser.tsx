import { getAllThreadsByUser } from "@/features/dashboard/services/profile.services";
import { ThreadsType } from "@/types/thread.types";
import { getRelativeTime } from "@/utils/getRelativeTimes";
import { Box, HStack, Image, Link, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

interface ThreadByUserProps {
  token: string; // Terima token sebagai props
}

export default function ThreadByUser({ token }: ThreadByUserProps) {
  const [threads, setThreads] = useState<ThreadsType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      retrieveAllThreads();
    }
  }, [token]);

  const retrieveAllThreads = async () => {
    try {
      const threads = await getAllThreadsByUser(token); // Gunakan token yang diterima
      setThreads(threads);
    } catch (error) {
      console.error("Error fetching threads:", error);
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
            <VStack align="start" gap="1">
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
              <VStack>
                <Link href={`/thread/${thread.id}`}>
                  <Text fontWeight="350" style={{ fontSize: "13px", textAlign: "justify" }} color="white">
                    {thread.content}
                  </Text>
                </Link>
                {thread.image && (
                  <Link href="/DetailImage">
                    <Image src={thread.image} borderRadius="10px" w="full" />
                  </Link>
                )}
              </VStack>
              <HStack gap="7" display="flex" alignItems="center">
                <HStack display="flex" alignItems="center" cursor="pointer">
                  {thread.isLike ? (
                    <FcLike style={{ color: "white", fontSize: "17px" }} />
                  ) : (
                    <FaRegHeart style={{ color: "white", fontSize: "17px" }} />
                  )}
                  <Text fontWeight="medium" color="#909090" style={{ fontSize: "11px" }}>
                    {thread._count?.like || 0}
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



