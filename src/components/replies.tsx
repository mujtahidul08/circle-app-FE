// import { getAllReplies } from "@/features/dashboard/services/replies.services";
import { useReplyStore } from "@/hooks/store/replyStore";
import useUserStore from "@/hooks/store/userStore";
import { apiURL } from "@/utils/baseurl";
import { getRelativeTime } from "@/utils/getRelativeTimes";
// import { RepliesType } from "@/types/reply.types";
import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { useParams } from "react-router-dom";

interface RepliesProps {
  threadId: string;
}
// Di dalam function Replies
// const Replies: React.FC<RepliesProps> = ({ threadId }) => {
const Replies: React.FC<RepliesProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useUserStore();
  const { replies, fetchReplies,toggleLikeReply  } = useReplyStore();

  useEffect(() => {
    if (token && id) {
      fetchReplies(token, id);
      console.log('Replies data:', replies);
    }

  }, [token, id, fetchReplies]);

  const handleLikeReply = async (replyId: number, liked: boolean) => {
    try {
      await axios.post(
        `${apiURL}api/thread/replies/${replyId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toggleLikeReply(replyId, liked);
    } catch (error) {
      console.error("Failed to like reply:", error);
    }
  };

  return (
    <Box w="full" h="fit">
      {replies.length > 0 ? (
        replies
        
        .map((reply, index) => (
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
              src={reply.author?.profile?.avatarImage || "https://bit.ly/naruto-sage"}
              boxSize="40px"
              borderRadius="full"
              fit="cover"
            />
            <VStack align="start" gap="1">
              <HStack>
                <Text fontWeight="medium" textStyle="sm" color="white">
                  {reply.author?.username || 'Unknown User'}
                </Text>
                <Text color="#909090" textStyle="xs">
                  {reply.author?.email || 'No email provided'}
                </Text>
                <Text color="#909090" textStyle="xs">
                  • {reply.createdAt ? getRelativeTime(reply.createdAt) : "Unknown time"}
                </Text>
              </HStack>
              <Text fontWeight="350" style={{ fontSize: "13px", textAlign: "justify" }} color="white">
                {reply.content}
              </Text>
              {reply.image && <Image src={reply.image} borderRadius="10px" w="full" />}
              <HStack gap="7" display="flex" alignItems="center">
                <HStack display="flex" alignItems="center">  
                <button onClick={() => handleLikeReply(reply.id, !reply.isLike)}>
                  {reply.isLike ? <FcLike fontSize="17px"style={{ color: "white"}}/> : <FaRegHeart style={{ color: "white"}} fontSize="17px" />}
                </button>
                <Text fontWeight="medium" color="#909090" fontSize="11px">
                  {reply.likeCount || 0} Likes
                </Text>
                </HStack>  
            </HStack> 
            </VStack>
          </HStack>
        ))
      ) : (
        <Text color="white">No replies yet</Text>
      )}
    </Box>
  );
}

export default Replies;

// interface RepliesProps {
//   threadId: string;
// }
// // Di dalam function Replies
// const Replies: React.FC<RepliesProps> = ({ threadId }) => {
//   const { id } = useParams<{ id: string }>(); // Mendapatkan threadId dari URL
//   const [replies, setReplies] = useState<RepliesType[]>([]);
//   const { token } = useUserStore();
  
//   useEffect(() => {
//     if (token && id) {
//       retrieveAllReplies(token, id); // Mengambil replies berdasarkan threadId
//     }
//   }, [token, id]);

//   const retrieveAllReplies = async (token: string, threadId: string) => {
//     try {
//       const replies = await getAllReplies(token, threadId);
//       console.log("Replies:", replies);
//       setReplies(replies);
//     } catch (error) {
//       console.log("Error fetching replies:", error);
//     }
//   };

//   return (
//     <Box w="full" h="fit">
//       {replies.length > 0 ? (
//         replies.map((reply, index) => (
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
//             <Image
//               src={reply.author.profile?.avatarImage || "https://bit.ly/naruto-sage"}
//               boxSize="40px"
//               borderRadius="full"
//               fit="cover"
//             />
//             <VStack align="start" gap="1">
//               <HStack>
//                 <Text fontWeight="medium" textStyle="sm" color="white">
//                   {reply.author.username}
//                 </Text>
//                 <Text color="#909090" textStyle="xs">
//                   {reply.author.email}
//                 </Text>
//                 <Text color="#909090" textStyle="xs">
//                   • {getRelativeTime(reply.createdAt)}
//                 </Text>
//               </HStack>
//               <Text fontWeight="350" style={{ fontSize: "13px", textAlign: "justify" }} color="white">
//                 {reply.content}
//               </Text>
//               {reply.image && <Image src={reply.image} borderRadius="10px" w="full" />}
//               <HStack gap="7" display="flex" alignItems="center">
//                 <HStack display="flex" alignItems="center">  
//                     {reply.isLike ? (  
//                         <FcLike style={{ color: "white", fontSize: "17px" }} />  
//                         ) : (  
//                         <FaRegHeart style={{ color: "white", fontSize: "17px" }} />  
//                         )}

//                 </HStack>  
//                 <HStack display="flex" alignItems="center">  
//                     <Text fontWeight="medium" color="#909090" style={{fontSize:"11px"}}> Edit</Text>
//                     <Text fontWeight="medium" color="#909090" style={{fontSize:"11px"}}> Delete</Text>  
//                 </HStack>
//             </HStack> 
//             </VStack>
//           </HStack>
//         ))
//       ) : (
//         <Text color="white">No replies yet</Text>
//       )}
//     </Box>
//   );
// }

// export default Replies;