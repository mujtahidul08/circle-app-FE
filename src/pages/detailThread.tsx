import { Link,Box, HStack, Image, Stack, Text, VStack, DialogRoot, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogBody } from "@chakra-ui/react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import Replies from "@/components/replies";
import {  useParams } from "react-router-dom";
import { useEffect} from "react";
import { getThreadById } from "@/features/dashboard/services/thread.services";
import useUserStore from "@/hooks/store/userStore";
import DialogCreateReply from "@/components/dialogCreateReply";
import { getTime } from "@/utils/getTime";
import axios from "axios";
import { useThreadStore } from "@/hooks/store/threadStore";
import { useReplyStore } from "@/hooks/store/replyStore";
import useFollowStore from "@/hooks/store/followStore";

export default function DetailThread() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useUserStore();
  const { currentThread, setCurrentThread, clearThread, toggleLikeThread,fetchThreads} = useThreadStore();
  const { fetchReplies } = useReplyStore();
  const { updateCounts } = useFollowStore(); // Ambil fungsi updateCounts dari useFollowStore

  useEffect(() => {
    if (id && token) {
      fetchThreadDetail(id);
      fetchThreads(token)
      fetchReplies(token, id);
      updateCounts(); // Memperbarui jumlah followers dan following
    }

    return () => {
      clearThread();
    };
  }, [id, token, updateCounts,fetchReplies,updateCounts,fetchThreads]); // Tambahkan updateCounts ke dependency array

  const fetchThreadDetail = async (threadId: string) => {
    try {
      const threadDetail = await getThreadById(threadId, token || "");
      setCurrentThread(threadDetail);
      console.log("DetailThread.tsx Detail Thread",threadDetail)
      console.log("Current User", user);
      console.log("CurrentThread Image:", currentThread?.image);
      console.log("Thread Image:", threadDetail.image);
    } catch (error) {
      console.error("Failed to fetch thread detail:", error);
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

  // const handleDeleteThread = async () => {
  //   try {
  //     await axios.delete(`/api/thread/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     Swal.fire({
  //       title: "Success",
  //       text: "Thread has been deleted.",
  //       icon: "success",
  //     });
  //   } catch (error) {
  //     console.error("Failed to delete thread:", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: "There was an issue deleting the thread.",
  //       icon: "error",
  //     });
  //   }
  // };

  return (
    <>
      {currentThread && (
        <Box className="p-3" borderBottomWidth="1px" borderColor="#3F3F3F" gap="4" overflowY="auto" scrollBehavior="smooth" scrollbar="hidden">
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
            <Stack  w="full">
              {currentThread && currentThread.image?(
                <>
                {/* <Image src={currentThread.image} borderRadius="10px" w="full" /> */}
                <DialogRoot size="cover" placement="center">
                  <DialogTrigger>
                      <Box m="0">
                        <Image src={currentThread.image} borderRadius="10px" w="90%" />
                      </Box>
                  </DialogTrigger>

                  <DialogContent bgColor="white">
                      <DialogHeader color="white" >
                          <DialogTitle>Detail Image</DialogTitle>
                      </DialogHeader>
                      <DialogBody>
                          <HStack >
                              <Box mt="3" display="flex" justifyContent="center" w="50%">
                                  <Image src={currentThread?.image} alt="Preview" boxSize="100px" objectFit="cover" borderRadius="md" />
                              </Box>
                              <VStack overflowY="auto" scrollBehavior="smooth" scrollbar="hidden" w="50%">
                                  <DialogCreateReply threadId={String(currentThread?.id)} onReplySuccess={() => fetchReplies(token!, id!)}/>
                                  <Replies threadId={String(currentThread?.id)}/>
                              </VStack>
                          </HStack>
                      </DialogBody>
                  </DialogContent>
                </DialogRoot>
                </>
              ):(
                <Text>No image available</Text>
              )}
            </Stack>
            <HStack>
              <Text color="#909090" textStyle="xs">
                {getTime(currentThread.createdAt)} •
              </Text>
              <Text color="#909090" textStyle="xs">
                {new Date(currentThread.createdAt).toLocaleDateString()}
              </Text>
            </HStack>
            <HStack gap="7" display="flex" alignItems="center">
              <HStack
                display="flex"
                alignItems="center"
                onClick={() => handleLike(Number(currentThread.id))}
                cursor="pointer"
              >
                {currentThread?.isLike ? (
                  <FcLike style={{ color: "white", fontSize: "17px" }} />
                ) : (
                  <FaRegHeart style={{ color: "white", fontSize: "17px" }} />
                )}
                <Text fontWeight="medium" color="#909090" style={{ fontSize: "11px" }}>
                  {currentThread?._count?.like || 0}
                </Text>
              </HStack>
              <HStack display="flex" alignItems="center">
                <BiCommentDetail style={{ fontSize: "17px", color: "white" }} />
                <Text fontWeight="medium" color="#909090" style={{ fontSize: "11px" }}>
                  {currentThread._count?.replies || 0} Comments
                </Text>
              </HStack>
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
