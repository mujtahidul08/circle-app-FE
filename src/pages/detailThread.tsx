import { Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import Replies from "@/components/replies";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThreadsType } from "@/types/thread.types";
import { getThreadById } from "@/features/dashboard/services/thread.services";
import useUserStore from "@/hooks/userStore";
import DialogCreateReply from "@/components/dialogCreateReply";
import { getTime } from "@/utils/getTime";


export default function DetailThread (){
    const { id } = useParams<{ id: string }>();
    const [thread, setThread] = useState<ThreadsType | null>(null);
    const { token } = useUserStore();
  
    useEffect(() => {
      if (id && token) {
        fetchThreadDetail(id);
      }
    }, [id, token]);
  
    const fetchThreadDetail = async (threadId: string) => {
      try {
        const threadDetail = await getThreadById(threadId, token || "");
        setThread(threadDetail);
      } catch (error) {
        console.error("Failed to fetch thread detail:", error);
      }
    };
    return(
        <>
         {thread && (
        <Box className="p-3" borderBottomWidth="1px" borderColor="#3F3F3F" gap="4">
            <VStack className="p-3" gap="4" align="start">
                <HStack >
                    <Image
                        src={thread.author.profile?.avatarImage || "https://bit.ly/naruto-sage"}
                        boxSize="40px"
                        borderRadius="full"
                        fit="cover"
                    />
                    <Stack spaceY="-1.5">            
                        <Text fontWeight="medium" textStyle="sm" color="white">{thread.author.username} </Text>
                        <Text color="#909090" textStyle="xs">{thread.author.email}</Text>
                    </Stack>
                </HStack>
                <Text fontWeight="350" style={{fontSize:"13px", textAlign:"justify"}} color="white">{thread.content}</Text>  
                {thread.image && (  
                    <Image src={thread.image} borderRadius="10px" w="full" />  
                )}  
                <HStack>  
                    <Text color="#909090" textStyle="xs"> {getTime(thread.createdAt)} •</Text>  
                    <Text color="#909090" textStyle="xs"> {new Date(thread.createdAt).toLocaleDateString()}</Text>  
                </HStack>
                <HStack gap="7" display="flex" alignItems="center">
                    <HStack display="flex" alignItems="center">  
                        {thread.isLike ? (  
                            <FcLike style={{ color: "white", fontSize: "17px" }} />  
                            ) : (  
                            <FaRegHeart style={{ color: "white", fontSize: "17px" }} />  
                            )}
                        <Text
                            fontWeight="medium"
                            color="#909090"
                            style={{ fontSize: "11px" }}
                            >
                            {thread._count?.like || 0}
                        </Text>
                    </HStack>  
                    <HStack display="flex" alignItems="center">  
                        <BiCommentDetail style={{ color: "white", fontSize: "17px" }} />  
                        <Text fontWeight="medium" color="#909090" style={{fontSize:"11px"}}>{thread._count?.replies || 0}  Comments</Text>  
                    </HStack>
                    <HStack display="flex" alignItems="center">  
                        <Text fontWeight="medium" color="#909090" style={{fontSize:"11px"}}> Edit</Text>
                        <Text fontWeight="medium" color="#909090" style={{fontSize:"11px"}}> Delete</Text>  
                     </HStack>
                </HStack> 
            </VStack>
        </Box>   
        )}
        <DialogCreateReply threadId={id!}/>
        <Replies threadId={id!} />
        </>
    )
}