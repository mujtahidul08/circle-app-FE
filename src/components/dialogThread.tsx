import { Button, HStack, Image, Input, Box } from '@chakra-ui/react';
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
import { createThread } from '@/features/dashboard/services/thread.services';
import Swal from 'sweetalert2';
import useUserStore from '@/hooks/store/userStore';
import { useThreadStore } from '@/hooks/store/threadStore';

export default function DialogThread() {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { user, token } = useUserStore();
  const { fetchThreads } = useThreadStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content || !token) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Content and authentication are required!',
      });
      return;
    }

    try {
      await createThread(content, token, selectedFile);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Thread created successfully!',
        timer: 1500,
        showConfirmButton: false,
      });

      setContent('');
      setSelectedFile(null);
      setPreviewImage(null);
      await fetchThreads(token); // Update daftar thread
      navigate('/');
    } catch (error: any) {
      console.error('Error creating thread:', error.message);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create thread. Please try again.',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <HStack gap="2" padding="3" display="flex" align="center" borderBottomWidth="1px" borderColor="#3F3F3F">
          <Image
            src={user?.profile?.avatarImage || 'https://bit.ly/naruto-sage'}
            boxSize="40px"
            borderRadius="full"
            fit="cover"
          />
          <Input padding="1" placeholder="What is happening?!" color="white" />
          <BiImageAdd
            style={{ color: '#005E0E', fontSize: '35px', cursor: 'pointer' }}
            onClick={() => fileInputRef.current?.click()}
          />
          <Button fontSize="13px" padding="-3" type="submit" height="35px" width="13%" rounded="20px" bgColor="#005E0E" color="white">
            Post
          </Button>
        </HStack>
      </DialogTrigger>
      <DialogContent bgColor="#1D1D1D">
        <form onSubmit={handleSubmit}>
          <DialogHeader color="white" />
          <DialogBody>
            <HStack>
              <Image src={user?.profile?.avatarImage || 'https://bit.ly/naruto-sage'} boxSize="40px" borderRadius="full" fit="cover" />
              <Input padding="1" placeholder="What is happening?!" color="white" value={content} onChange={(e) => setContent(e.target.value)} />
            </HStack>
            {previewImage && (
              <Box mt="3" display="flex" justifyContent="center">
                <Image src={previewImage} alt="Preview" boxSize="100px" objectFit="cover" borderRadius="md" />
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
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button fontSize="13px" padding="-3" type="submit" height="35px" width="13%" rounded="20px" bgColor="#005E0E" color="white">
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

// export default function DialogThread() {
//   const [content, setContent] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();

//   const {user,token } = useUserStore();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!content || !token) {
//       Swal.fire({
//         icon: "warning",
//         title: "Oops...",
//         text: "Content and authentication are required!",
//       });
//       return;
//     }

//     try {
//       await createThread(content, token, selectedFile);

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Thread created successfully!",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       setContent("");
//       setSelectedFile(null);
//       setPreviewImage(null);
//       navigate("/");
//     } catch (error: any) {
//       console.error("Error creating thread:", error.message);

//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "Failed to create thread. Please try again.",
//       });
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setSelectedFile(file);

//       // Preview gambar
//       const reader = new FileReader();
//       reader.onload = () => setPreviewImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };


//   return (
//     <DialogRoot>
//       <DialogTrigger asChild>
//         <HStack
//           gap="2"
//           padding="3"
//           display="flex"
//           align="center"
//           borderBottomWidth="1px"
//           borderColor="#3F3F3F"
//         >
//           <Image
//             src="https://bit.ly/naruto-sage"
//             boxSize="40px"
//             borderRadius="full"
//             fit="cover"
//           />
//           <Input
//             padding="1"
//             placeholder="What is happening?!"
//             color="white"
//           />
//           <BiImageAdd
//             style={{ color: '#005E0E', fontSize: '35px', cursor: 'pointer' }}
//             onClick={() => fileInputRef.current?.click()}
//           />
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
//             Post
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
//                 placeholder="What is happening?!"
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
