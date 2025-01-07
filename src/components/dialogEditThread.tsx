import { Button, HStack, Image, Input, Box, Text } from '@chakra-ui/react';
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
import { ThreadsType } from '@/types/thread.types';

export default function DialogEditThread({ thread }: { thread: ThreadsType }) {
  const [content, setContent] = useState(thread.content || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(thread.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { token } = useUserStore();
  const { updateThread } = useThreadStore();

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
      const formData = new FormData();
      formData.append('content', content);
      if (selectedFile) formData.append('image', selectedFile);

      await updateThread(thread.id, formData, token);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Thread updated successfully!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update thread. Please try again.',
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
    <DialogRoot placement="center">
      <DialogTrigger asChild>
        <Text fontWeight="medium" color="#909090" style={{ fontSize: '11px', cursor: 'pointer' }}>
          Edit
        </Text>
      </DialogTrigger>
      <DialogContent bgColor="#1D1D1D">
        <form onSubmit={handleSubmit}>
          <DialogHeader color="white" />
          <DialogBody>
            <Input padding="1" placeholder="Edit Thread" color="white" value={content} onChange={(e) => setContent(e.target.value)} />
            {previewImage && (
              <Box mt="3" display="flex" justifyContent="center">
                <Image src={previewImage} alt="Preview" boxSize="100px" objectFit="cover" borderRadius="md" />
              </Box>
            )}
          </DialogBody>
          <DialogFooter>
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
            <Button fontSize="13px" type="submit" height="35px" width="13%" rounded="20px" bgColor="#005E0E" color="white">
              Save
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}