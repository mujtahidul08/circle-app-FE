import { Box, Button, HStack, Image, Input } from '@chakra-ui/react';
import { BiImageAdd } from 'react-icons/bi';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { createReply } from '@/features/dashboard/services/replies.services';
import useUserStore from '@/hooks/store/userStore';
import { useReplyStore } from '@/hooks/store/replyStore';

export default function DialogCreateReply({
  threadId,
  onReplySuccess,
}: {
  threadId: string;
  onReplySuccess: () => void;
}) {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Tambahkan state untuk preview image
  const { user, token} = useUserStore();
  const { addReply } = useReplyStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Tampilkan preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Atur preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content || !token) {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Content cannot be empty!' });
      return;
    }

    try {
      const newReply = await createReply(content, token, selectedFile, threadId);
      addReply(newReply); // Tambahkan reply baru ke Zustand store

      Swal.fire({ icon: 'success', title: 'Success', text: 'Reply created successfully!', timer: 1500, showConfirmButton: false });
      setContent('');
      onReplySuccess();
      setSelectedFile(null);
      setPreviewImage(null); // Reset preview image
      navigate(`/thread/${threadId}`);

    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to create reply.' });
    }
  };

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <HStack gap="2" padding="3" display="flex" align="center" borderBottomWidth="1px" borderColor="#3F3F3F">
          <Image src={user?.profile?.avatarImage || 'https://bit.ly/naruto-sage'} boxSize="40px" borderRadius="full" fit="cover" />
          <Input
            padding="1"
            placeholder="Reply this thread?!"
            color="white"
          />
          <BiImageAdd style={{ color: '#005E0E', fontSize: '35px' }} onClick={() => fileInputRef.current?.click()} />
          <Button
            fontSize="13px"
            padding="-3"
            type="submit"
            height="35px"
            width="13%"
            rounded="20px"
            bgColor="#005E0E"
            color="white"
          >
            Post Reply
          </Button>
        </HStack>
      </DialogTrigger>
      <DialogContent bgColor="#1D1D1D">
        <form onSubmit={handleSubmit}>
          <DialogHeader color="white" />
          <DialogBody>
            <HStack>
              <Image
                src=  'https://bit.ly/naruto-sage'
                boxSize="40px"
                borderRadius="full"
                fit="cover"
              />
              <Input
                padding="1"
                placeholder="Reply this thread?!"
                color="white"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </HStack>
            {previewImage && (
              <Box mt="3" display="flex" justifyContent="center">
                <Image
                  src={previewImage}
                  alt="Preview"
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
              </Box>
            )}
          </DialogBody>
          <DialogFooter>
            <HStack>
              <BiImageAdd
                style={{ color: '#005E0E', fontSize: '35px', cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button
                fontSize="13px"
                padding="-3"
                type="submit"
                height="35px"
                width="13%"
                rounded="20px"
                bgColor="#005E0E"
                color="white"
              >
                Post
              </Button>
            </HStack>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

// export default function DialogCreateReply({ threadId }: { threadId: string }) {
//   const [content, setContent] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null); // Tambahkan state untuk preview image
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();
//   const {user,token } = useUserStore();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!content || !token) {
//       Swal.fire({
//         icon: "warning",
//         title: "Oops...",
//         text: "Content cannot be empty!",
//       });
//       return;
//     }

//     try {
//       await createReply(content, token || "", selectedFile, threadId);

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Reply created successfully!",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       setContent("");
//       setSelectedFile(null);
//       setPreviewImage(null); // Reset preview image setelah submit
//       navigate(`/thread/${threadId}`);
//     } catch (error: any) {
//       console.error("Error creating reply:", error.message);

//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to create reply. Please try again.",
//       });
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setSelectedFile(file);

//       // Menampilkan preview gambar
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result as string); // Set preview image
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <DialogRoot>
//       <DialogTrigger asChild>
//         <HStack gap="2" padding="3" display="flex" align="center" borderBottomWidth="1px" borderColor="#3F3F3F">
//           <Image src="https://bit.ly/naruto-sage" boxSize="40px" borderRadius="full" fit="cover" />
//           <Input
//             padding="1"
//             placeholder="Reply this thread?!"
//             color="white"
//           />
//           <BiImageAdd style={{ color: '#005E0E', fontSize: '35px' }} onClick={() => fileInputRef.current?.click()} />
//           <Button
//             fontSize="13px"
//             padding="-3"
//             type="submit"
//             height="35px"
//             width="13%"
//             rounded="20px"
//             bgColor="#005E0E"
//             color="white"
//           >
//             Post Reply
//           </Button>
//         </HStack>
//       </DialogTrigger>
//       <DialogContent bgColor="#1D1D1D">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader color="white" />
//           <DialogBody>
//             <HStack>
//               <Image
//                 src="https://bit.ly/naruto-sage"
//                 boxSize="40px"
//                 borderRadius="full"
//                 fit="cover"
//               />
//               <Input
//                 padding="1"
//                 placeholder="Reply this thread?!"
//                 color="white"
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//               />
//             </HStack>
//             {previewImage && (
//               <Box mt="3" display="flex" justifyContent="center">
//                 <Image
//                   src={previewImage}
//                   alt="Preview"
//                   boxSize="100px"
//                   objectFit="cover"
//                   borderRadius="md"
//                 />
//               </Box>
//             )}
//           </DialogBody>
//           <DialogFooter>
//             <HStack>
//               <BiImageAdd
//                 style={{ color: '#005E0E', fontSize: '35px', cursor: 'pointer' }}
//                 onClick={() => fileInputRef.current?.click()}
//               />
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 style={{ display: "none" }}
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />
//               <Button
//                 fontSize="13px"
//                 padding="-3"
//                 type="submit"
//                 height="35px"
//                 width="13%"
//                 rounded="20px"
//                 bgColor="#005E0E"
//                 color="white"
//               >
//                 Post
//               </Button>
//             </HStack>
//           </DialogFooter>
//         </form>
//         <DialogCloseTrigger />
//       </DialogContent>
//     </DialogRoot>
//   );
// }


