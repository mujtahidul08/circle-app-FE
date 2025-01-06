// import { getAllThreads, likeThread } from "@/features/dashboard/services/thread.services";
// import useLikeStore from "@/hooks/store/likeStore";
import { useThreadStore } from "@/hooks/store/threadStore";
import useUserStore from "@/hooks/store/userStore";
import { ThreadsType } from "@/types/thread.types";
import { getRelativeTime } from "@/utils/getRelativeTimes";
import { Box, HStack, Image, Link, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
// import { useEffect, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
// import { useNavigate } from "react-router-dom";

export default function Thread() {
  const threads = useThreadStore((state) => state.threads);
  const toggleLikeThread = useThreadStore((state) => state.toggleLikeThread);
  const { token } = useUserStore();
  const fetchThreads = useThreadStore((state) => state.fetchThreads);

  useEffect(() => {
    if (token) {
      fetchThreads(token).then(() => {
        console.log('Threads in state after fetch:', threads);
      });
    }
  }, [token, fetchThreads]);

  const handleLike = async (threadId: number) => {
    if (!token) {
      console.error('Token is null. Cannot toggle like.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/thread/like/${threadId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toggleLikeThread({
        threadId: response.data.threadId,  // Pastikan ini sesuai dengan nilai yang diterima dari response
        liked: response.data.liked,
        likeCount: response.data.likeCount,
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };
  console.log('Thread.tsx Threads in state:', threads);
  
  return (
    <Box w="full" h="fit">
      {threads.length > 0 &&
  threads.map((thread: ThreadsType, index: number) => (
    <HStack 
      key={index}
      p="3"
      borderBottomWidth="1px"
      borderColor="#3F3F3F"
      gap="4"
      display="flex"
      justifyContent="start"
      alignItems="flex-start"
      width="full"
    >
    <Link href={`/profile/${thread.authorId}`}>
      <Image
        className="flex justify-start align-top"
        src={thread.author.profile?.avatarImage || "https://bit.ly/naruto-sage"}
        boxSize="40px"
        borderRadius="full"
        fit="cover"
        alignSelf="flex-start"
      />
    </Link>
    <VStack align="start" gap="1">
      <HStack>
        <Link href={`/profile/${thread.authorId}`}>
          <Text fontWeight="medium" textStyle="sm" color="white" width="full">
            {thread.author.username}
          </Text>
        </Link>
        <Link href={`/profile/${thread.authorId}`}>
          <Text color="#909090" textStyle="xs">
            {thread.author.email}
          </Text>
        </Link>
        <Text color="#909090" textStyle="xs">
          • {getRelativeTime(thread.createdAt)}
        </Text>
      </HStack>
      <VStack   w="100" display="flex" justifyContent="flex-start">
        <Link href={`/thread/${thread.id}`}>
          <Text
            fontWeight="350"
            style={{ fontSize: "13px" }}
            color="white"
            display="flex"
            justifyContent="start"
          >
            {thread.content}
          </Text>
        </Link>
        {thread.image && (
          <Box m="0">
          <Link href="/DetailImage">
            <Image
              src={thread.image}
              borderRadius="10px"
              w="full"

            />
          </Link>
          </Box>
        )}
      </VStack>
      <HStack gap="7" display="flex" alignItems="center">
        <HStack
          display="flex"
          alignItems="center"
          onClick={() => handleLike(Number(thread.id))}
          cursor="pointer"
        >
          {thread.isLike ? (
            <FcLike
              style={{ color: "white", fontSize: "17px" }}
            />
          ) : (
            <FaRegHeart
              style={{ color: "white", fontSize: "17px" }}
            />
          )}
          <Text
            fontWeight="medium"
            color="#909090"
            style={{ fontSize: "11px" }}
          >
            {thread._count?.like || 0}
          </Text>
        </HStack>
        <Link href={`/thread/${thread.id}`}>
          <HStack display="flex" alignItems="center">
          <Link href={`/thread/${thread.id}`}>
            <BiCommentDetail
              style={{ color: "white", fontSize: "17px" }}
            />
            <Text
              fontWeight="medium"
              color="#909090"
              style={{ fontSize: "11px" }}
            >
              {thread._count?.replies || 0} Comments
            </Text>
            </Link>
          </HStack>
        </Link>
      </HStack>
    </VStack>
  </HStack>
))}
    </Box>
  );
}


// export default function Thread() {
//   const toggleLike = useLikeStore((state) => state.toggleLike);
//   const [threads, setThreads] = useState<ThreadsType[]>([]);
//   const { token } = useUserStore();
//   const navigate = useNavigate();
  
//   useEffect(() => {
//       if (token) {
//           retrieveAllThreads(token);
//         }
//   }, [token]);
  
//   const retrieveAllThreads = async (token: string) => {
//       try {
//         const threads = await getAllThreads(token);  
//         console.log("list all threads", threads);
//         setThreads(threads);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const toggleLikeThread = async (threadId: number, index: number) => {
//       if (!token) {
//         console.error('Token is null. Cannot toggle like.');
//         return;
//       }
    
//       try {
//         const response = await likeThread(threadId, token); // Panggil API
//         const updatedThreads = threads.map((thread, i) =>
//           i === index
//             ? {
//                 ...thread,
//                 isLike: response.data.liked,
//                 _count: {
//                   ...thread._count,
//                   like: response.data.likeCount,
//                 },
//               }
//             : thread
//         );
//         setThreads(updatedThreads); // Perbarui state
//         console.log('Updated threads:', updatedThreads);
//       } catch (error) {
//         console.error('Failed to toggle like:', error);
//       }
//     };

// return (
//   <Box w="full" h="fit">
//   {threads.length > 0 &&
//       threads.map((thread: ThreadsType, index: number) => (
//         <HStack
//           key={index}
//           p="3"
//           borderBottomWidth="1px"
//           borderColor="#3F3F3F"
//           gap="4"
//           display="flex"
//           justifyContent="start"
//           alignItems="flex-start"
//           w="full"
//           h="full"
//         >
//         <Link href={`/profile/${thread.authorId}`}>
//           <Image
//             className="flex justify-start align-top"
//             src={thread.author.profile?.avatarImage || "https://bit.ly/naruto-sage"}
//             boxSize="40px"
//             borderRadius="full"
//             fit="cover"
//             alignSelf="flex-start"
//           />
//         </Link>
//           <VStack align="start" gap="1">
//             <HStack>
//             <Link href={`/profile/${thread.authorId}`}>
//               <Text fontWeight="medium" textStyle="sm" color="white">
//                 {thread.author.username}
//               </Text>
//             </Link>
//             <Link href={`/profile/${thread.authorId}`}>
//               <Text color="#909090" textStyle="xs">
//                 {thread.author.email}
//               </Text>
//             </Link>
//               <Text color="#909090" textStyle="xs">
//                 • {getRelativeTime(thread.createdAt)}
//               </Text>
//             </HStack>
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
//                     <Image
//                       src={thread.image}
//                       borderRadius="10px"
//                       w="full"
//                     />
//                   </Link>
//                 )}
//               </VStack>
//             <HStack gap="7" display="flex" alignItems="center">
//               <HStack
//                 display="flex"
//                 alignItems="center"
//                 onClick={() => toggleLikeThread(thread.id, index)}
//                 cursor="pointer"
//               >
//                 {thread.isLike ? (
//                   <FcLike
//                     style={{ color: "white", fontSize: "17px" }}
//                   />
//                 ) : (
//                   <FaRegHeart
//                     style={{ color: "white", fontSize: "17px" }}
//                   />
//                 )}
//                 <Text
//                   fontWeight="medium"
//                   color="#909090"
//                   style={{ fontSize: "11px" }}
//                 >
//                    {thread._count?.like || 0}
//                 </Text>
//               </HStack>
//               <HStack display="flex" alignItems="center" onClick={() => navigate(`/replies/${thread.id}`)}>
//                   <BiCommentDetail
//                     style={{ color: "white", fontSize: "17px" }}
//                     />
//                   <Text
//                     fontWeight="medium"
//                     color="#909090"
//                     style={{ fontSize: "11px" }}
//                   >
//                     {thread._count?.replies || 0} Comments
//                   </Text>
//               </HStack>
//               <HStack display="flex" alignItems="center">  
//               </HStack>
//             </HStack>
//           </VStack>
//         </HStack>
//       ))}
//   </Box>
// );
// }


