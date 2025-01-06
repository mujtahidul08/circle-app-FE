import { Link,Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import Replies from "@/components/replies";
import {  useParams } from "react-router-dom";
import { useEffect, useState} from "react";
import { getThreadById } from "@/features/dashboard/services/thread.services";
import useUserStore from "@/hooks/store/userStore";
import DialogCreateReply from "@/components/dialogCreateReply";
import { getTime } from "@/utils/getTime";
import Swal from "sweetalert2";
import axios from "axios";
import { useThreadStore } from "@/hooks/store/threadStore";
import { useReplyStore } from "@/hooks/store/replyStore";
import useFollowStore from "@/hooks/store/followStore";

export default function DetailThread() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useUserStore();
  const { currentThread, setCurrentThread, clearThread, toggleLikeThread } = useThreadStore();
  const { fetchReplies } = useReplyStore();
  const { updateCounts } = useFollowStore(); // Ambil fungsi updateCounts dari useFollowStore

  useEffect(() => {
    if (id && token) {
      fetchThreadDetail(id);
      fetchReplies(token, id);
      updateCounts(); // Memperbarui jumlah followers dan following
    }

    return () => {
      clearThread();
    };
  }, [id, token, updateCounts]); // Tambahkan updateCounts ke dependency array

  const fetchThreadDetail = async (threadId: string) => {
    try {
      const threadDetail = await getThreadById(threadId, token || "");
      setCurrentThread(threadDetail);
    } catch (error) {
      console.error("Failed to fetch thread detail:", error);
    }
  };

  const handleDeleteThread = async () => {
    try {
      await axios.delete(`/api/thread/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
    <>
      {currentThread && (
        <Box className="p-3" borderBottomWidth="1px" borderColor="#3F3F3F" gap="4">
          <VStack className="p-3" gap="4" align="start">
            <HStack>
              <Link href={`/profile/${currentThread.author.id}`}>
                <Image
                  src={currentThread.author.profile?.avatarImage || "https://bit.ly/naruto-sage"}
                  boxSize="40px"
                  borderRadius="full"
                  fit="cover"
                />
              </Link>
              <Link href={`/profile/${currentThread.author.id}`}>
                <Stack spaceY="-1.5">
                  <Text fontWeight="medium" textStyle="sm" color="white">
                    {currentThread.author.username}
                  </Text>
                  <Text color="#909090" textStyle="xs">{currentThread.author.email}</Text>
                </Stack>
              </Link>
            </HStack>
            <Text
              fontWeight="350"
              style={{ fontSize: "13px", textAlign: "justify" }}
              color="white"
            >
              {currentThread.content}
            </Text>
            {currentThread.image && (
              <Image src={currentThread.image} borderRadius="10px" w="full" />
            )}
            <HStack>
              <Text color="#909090" textStyle="xs">
                {getTime(currentThread.createdAt)} •
              </Text>
              <Text color="#909090" textStyle="xs">
                {new Date(currentThread.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
            <HStack gap="7" display="flex" alignItems="center">
              <HStack display="flex" alignItems="center">
                <button
                  onClick={() =>
                    toggleLikeThread({
                      threadId: currentThread.id,
                      liked: !currentThread.isLike,
                      likeCount:
                        (currentThread._count?.like || 0) + (currentThread.isLike ? -1 : 1),
                    })
                  }
                >
                  {currentThread.isLike ? (
                    <FcLike style={{ fontSize: "17px", color: "white" }} />
                  ) : (
                    <FaRegHeart style={{ fontSize: "17px", color: "white" }} />
                  )}
                </button>
                <Text fontWeight="medium" color="#909090" style={{ fontSize: "11px" }}>
                  {currentThread._count?.like || 0}
                </Text>
              </HStack>
              <HStack display="flex" alignItems="center">
                <BiCommentDetail style={{ fontSize: "17px", color: "white" }} />
                <Text fontWeight="medium" color="#909090" style={{ fontSize: "11px" }}>
                  {currentThread._count?.replies || 0} Comments
                </Text>
              </HStack>
              {user?.id && String(currentThread.author.id) === String(user.id) && (
                <HStack display="flex" alignItems="center" onClick={handleDeleteThread}>
                  <Text
                    fontWeight="medium"
                    color="red.500"
                    style={{ fontSize: "11px", cursor: "pointer" }}
                  >
                    Delete
                  </Text>
                </HStack>
              )}
            </HStack>
          </VStack>
        </Box>
      )}
      <DialogCreateReply
        threadId={id!}
        onReplySuccess={() => fetchReplies(token!, id!)}
      />
      <Replies threadId={id!} />
    </>
  );
}

// export default function DetailThread() {
//   const { id } = useParams<{ id: string }>();
//   const { token, user } = useUserStore();
//   const { currentThread, setCurrentThread, clearThread, toggleLikeThread } = useThreadStore();

//   useEffect(() => {
//     if (id && token) {
//       fetchThreadDetail(id);
//     }

//     return () => {
//       clearThread();
//     };
//   }, [id, token]);

//   const fetchThreadDetail = async (threadId: string) => {
//     try {
//       const threadDetail = await getThreadById(threadId, token || '');
//       setCurrentThread(threadDetail);
//     } catch (error) {
//       console.error('Failed to fetch thread detail:', error);
//     }
//   };

//   const handleDeleteThread = async () => {
//     try {
//       await axios.delete(`/api/thread/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       Swal.fire({
//         title: 'Success',
//         text: 'Thread has been deleted.',
//         icon: 'success',
//       });
//     } catch (error) {
//       console.error('Failed to delete thread:', error);
//       Swal.fire({
//         title: 'Error',
//         text: 'There was an issue deleting the thread.',
//         icon: 'error',
//       });
//     }
//   };

//   return (
//     <>
//       {currentThread && (
//         <Box className="p-3" borderBottomWidth="1px" borderColor="#3F3F3F" gap="4">
//           <VStack className="p-3" gap="4" align="start">
//             <HStack>
//               <Link href={`/profile/${currentThread.author.id}`}>
//                 <Image
//                   src={currentThread.author.profile?.avatarImage || 'https://bit.ly/naruto-sage'}
//                   boxSize="40px"
//                   borderRadius="full"
//                   fit="cover"
//                 />
//               </Link>
//               <Link href={`/profile/${currentThread.author.id}`}>
//                 <Stack spaceY="-1.5">
//                   <Text fontWeight="medium" textStyle="sm" color="white">{currentThread.author.username}</Text>
//                   <Text color="#909090" textStyle="xs">{currentThread.author.email}</Text>
//                 </Stack>
//               </Link>
//             </HStack>
//             <Text fontWeight="350" style={{ fontSize: '13px', textAlign: 'justify' }} color="white">
//               {currentThread.content}
//             </Text>
//             {currentThread.image && (
//               <Image src={currentThread.image} borderRadius="10px" w="full" />
//             )}
//             <HStack>  
//                 <Text color="#909090" textStyle="xs"> {getTime(currentThread.createdAt)} •</Text>  
//                 <Text color="#909090" textStyle="xs"> {new Date(currentThread.createdAt).toLocaleDateString()}</Text>  
//             </HStack>
//             <HStack gap="7" display="flex" alignItems="center">
//               <HStack display="flex" alignItems="center">
//                 <button onClick={() =>
//                   toggleLikeThread({
//                     threadId: currentThread.id,
//                     liked: !currentThread.isLike, // Toggle status like
//                     likeCount: (currentThread._count?.like || 0) + (currentThread.isLike ? -1 : 1), // Update jumlah like
//                   })
//                 }>
//                   {currentThread.isLike ? <FcLike style={{ fontSize: '17px',color: "white" }} /> : <FaRegHeart style={{ fontSize: '17px',color: "white" }} />}
//                 </button>
//                 <Text 
//                   fontWeight="medium" 
//                   color="#909090" 
//                   style={{ fontSize: '11px' }}>
//                   {currentThread._count?.like || 0}
//                 </Text>
//               </HStack>
//               <HStack display="flex" alignItems="center">
//                 <BiCommentDetail style={{ fontSize: '17px',color: "white" }} />
//                 <Text fontWeight="medium" color="#909090" style={{ fontSize: '11px' }}>
//                   {currentThread._count?.replies || 0} Comments
//                 </Text>
//               </HStack>
//               {user?.id && currentThread.author.id === user.id && (
//                 <HStack display="flex" alignItems="center" onClick={handleDeleteThread}>
//                   <Text fontWeight="medium" color="red.500" style={{ fontSize: '11px', cursor: 'pointer' }}>Delete</Text>
//                 </HStack>
//               )}
//             </HStack>
//           </VStack>
//         </Box>
//       )}
//       <DialogCreateReply threadId={id!}/>
//       <Replies threadId={id!} />
//     </>
//   );
// }
