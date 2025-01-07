import { Box, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger, HStack, Image, VStack } from "@chakra-ui/react";
import DetailPost from "../pages/detailThread";
import DetailThread from "../pages/detailThread";
import DialogCreateReply from "./dialogCreateReply";
import Replies from "./replies";
import { useParams } from "react-router-dom";
import useUserStore from "@/hooks/store/userStore";
import { useThreadStore } from "@/hooks/store/threadStore";
import { useReplyStore } from "@/hooks/store/replyStore";
import useFollowStore from "@/hooks/store/followStore";
import { useEffect } from "react";
import { getThreadById } from "@/features/dashboard/services/thread.services";

export default function DialogDetailImage(){
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
      console.log("Detail Thread",threadDetail)
      console.log("Current User", user);
      console.log("CurrentThread Image:", currentThread?.image);
    } catch (error) {
      console.error("Failed to fetch thread detail:", error);
    }
  };
    return(
        <DialogRoot size="cover" placement="center" motionPreset="slide-in-bottom">
            <DialogTrigger >
                <Box m="0">
                    {/* <Image src={currentThread?.image} borderRadius="10px" w="full" /> */}
                    <img src={currentThread?.image} />
                </Box>
            </DialogTrigger>

            <DialogContent bgColor="#1D1D1D">
                <DialogHeader color="white" >
                    <DialogTitle>Detail Image</DialogTitle>
                    <DialogCloseTrigger />
                </DialogHeader>
                <DialogBody>
                    <HStack >
                        <Box mt="3" display="flex" justifyContent="center">
                            <Image src={currentThread?.image} alt="Preview" boxSize="100px" objectFit="cover" borderRadius="md" />
                        </Box>
                        <VStack overflowY="auto" scrollBehavior="smooth" scrollbar="hidden">
                            <DetailThread/>
                            <DialogCreateReply threadId={String(currentThread?.id)} onReplySuccess={() => fetchReplies(token!, id!)}/>
                            <Replies threadId={String(currentThread?.id)}/>
                        </VStack>
                    </HStack>
                </DialogBody>
                <DialogFooter>
                </DialogFooter>;
            </DialogContent>
        </DialogRoot>
    )
}