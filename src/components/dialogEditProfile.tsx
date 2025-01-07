import {
  Box,
  Button,
  DialogRoot,
  Image,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import useUserStore from "@/hooks/store/userStore";

export default function DialogEditProfile({ user }: { user: any }) {
  const [username, setUsername] = useState<string>(user?.username || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [bio, setBio] = useState<string>(user?.profile?.bio || "");
  console.log("user edit",user)
  // States for file uploads
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  // States for image previews
  const [previewAvatar, setPreviewAvatar] = useState<string>(
    user?.profile?.avatarImage || ""
  );
  const [previewBackground, setPreviewBackground] = useState<string>(
    user?.profile?.backgroundImage || ""
  );

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = useUserStore((state) => state.updateProfile);
  const fetchProfile = useUserStore((state) => state.fetchProfile);

  // Handle file selection
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "background" | "avatar"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === "background") {
      setPreviewBackground(previewUrl);
      setBackgroundFile(file);
    } else if (type === "avatar") {
      setPreviewAvatar(previewUrl);
      setAvatarFile(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("bio", bio);
      if (avatarFile) formData.append("avatarImage", avatarFile);
      if (backgroundFile) formData.append("backgroundImage", backgroundFile);
  
      // Kirim formData ke API
      const response = await updateProfile(token, formData);
      await fetchProfile(token); 
      
      Swal.fire({
        icon: "success",
        title: "Profile Saved!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Swal.fire({
        icon: "error",
        title: "Failed to Save Profile",
        text: errorMessage,
      });
    }
  };

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button
          type="submit"
          borderRadius="30px"
          padding="8px"
          borderWidth="1px"
          height="30px"
          color="white"
          textStyle="xs"
          style={{ position: "absolute", bottom: "-35px", right: "0", zIndex: 2 }}
        >
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent bgColor="#1D1D1D">
        <DialogHeader>
          <DialogTitle color="white" fontSize="medium">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box position="relative" w="full" mb="9">
            <Image
              src={previewBackground}
              height="70px"
              width="100%"
              borderRadius="10px"
              style={{ position: "relative", zIndex: 1, cursor: "pointer" }}
              onClick={() => backgroundInputRef.current?.click()}
            />
            <input
              type="file"
              ref={backgroundInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => handleFileChange(e, "background")}
            />
            <Image
              src={previewAvatar}
              boxSize="48px"
              borderRadius="full"
              fit="cover"
              style={{
                position: "absolute",
                top: "47px",
                left: "10px",
                zIndex: 2,
                cursor: "pointer",
              }}
              onClick={() => avatarInputRef.current?.click()}
            />
            <input
              type="file"
              ref={avatarInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => handleFileChange(e, "avatar")}
            />
          </Box>
          <VStack gap="4">
            <Input
              width="100%"
              padding="4"
              rounded="md"
              borderWidth="1px"
              borderColor="#545454"
              placeholder="Username"
              color="white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              width="100%"
              padding="4"
              rounded="md"
              borderWidth="1px"
              borderColor="#545454"
              placeholder="Email"
              color="white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Textarea
              resize="none"
              width="100%"
              padding="4"
              rounded="md"
              borderWidth="1px"
              borderColor="#545454"
              placeholder="Bio"
              color="white"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button
            type="submit"
            width="100px"
            height="35px"
            rounded="50px"
            bgColor="#04A51E"
            color="white"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

// export default function DialogEditProfile({ user }: { user: any }) {
//   const [username, setUsername] = useState<string>(user?.username || "");
//   const [email, setEmail] = useState<string>(user?.email || "");
//   const [bio, setBio] = useState<string>(user?.profile?.bio || "");

//   // States for file uploads
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

//   // States for image previews
//   const [previewAvatar, setPreviewAvatar] = useState<string>(
//     user?.profile?.avatarImage || ""
//   );
//   const [previewBackground, setPreviewBackground] = useState<string>(
//     user?.profile?.backgroundImage || ""
//   );

//   const avatarInputRef = useRef<HTMLInputElement>(null);
//   const backgroundInputRef = useRef<HTMLInputElement>(null);

//   // Handle file selection
//   const handleFileChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: "background" | "avatar"
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const previewUrl = URL.createObjectURL(file);
//     if (type === "background") {
//       setPreviewBackground(previewUrl);
//       setBackgroundFile(file);
//     } else if (type === "avatar") {
//       setPreviewAvatar(previewUrl);
//       setAvatarFile(file);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized");

//       // Kirim data dengan file dan teks
      // const response = await updateProfile(token, {
//         username,
//         email,
//         bio,
//         avatarImage: avatarFile, // Kirim file avatar
//         backgroundImage: backgroundFile, // Kirim file background
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Profile Saved!",
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error occurred";
//       Swal.fire({
//         icon: "error",
//         title: "Failed to Save Profile",
//         text: errorMessage,
//       });
//     }
//   };

//   return (
//     <DialogRoot>
//       <DialogTrigger asChild>
//         <Button
//           type="submit"
//           borderRadius="30px"
//           padding="8px"
//           borderWidth="1px"
//           height="30px"
//           color="white"
//           textStyle="xs"
//           style={{ position: "absolute", bottom: "-35px", right: "0", zIndex: 2 }}
//         >
//           Edit Profile
//         </Button>
//       </DialogTrigger>
//       <DialogContent bgColor="#1D1D1D">
//         <DialogHeader>
//           <DialogTitle color="white" fontSize="medium">
//             Edit Profile
//           </DialogTitle>
//         </DialogHeader>
//         <DialogBody>
//           <Box position="relative" w="full" mb="9">
//             <Image
//               src={previewBackground}
//               height="70px"
//               width="100%"
//               borderRadius="10px"
//               style={{ position: "relative", zIndex: 1, cursor: "pointer" }}
//               onClick={() => backgroundInputRef.current?.click()}
//             />
//             <input
//               type="file"
//               ref={backgroundInputRef}
//               style={{ display: "none" }}
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, "background")}
//             />
//             <Image
//               src={previewAvatar}
//               boxSize="48px"
//               borderRadius="full"
//               fit="cover"
//               style={{
//                 position: "absolute",
//                 top: "47px",
//                 left: "10px",
//                 zIndex: 2,
//                 cursor: "pointer",
//               }}
//               onClick={() => avatarInputRef.current?.click()}
//             />
//             <input
//               type="file"
//               ref={avatarInputRef}
//               style={{ display: "none" }}
//               accept="image/*"
//               onChange={(e) => handleFileChange(e, "avatar")}
//             />
//           </Box>
//           <VStack gap="4">
//             <Input
//               width="100%"
//               padding="4"
//               rounded="md"
//               borderWidth="1px"
//               borderColor="#545454"
//               placeholder="Username"
//               color="white"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <Input
//               width="100%"
//               padding="4"
//               rounded="md"
//               borderWidth="1px"
//               borderColor="#545454"
//               placeholder="Email"
//               color="white"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <Textarea
//               resize="none"
//               width="100%"
//               padding="4"
//               rounded="md"
//               borderWidth="1px"
//               borderColor="#545454"
//               placeholder="Bio"
//               color="white"
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//             />
//           </VStack>
//         </DialogBody>
//         <DialogFooter>
//           <Button
//             type="submit"
//             width="100px"
//             height="35px"
//             rounded="50px"
//             bgColor="#04A51E"
//             color="white"
//             onClick={handleSave}
//           >
//             Save
//           </Button>
//         </DialogFooter>
//         <DialogCloseTrigger />
//       </DialogContent>
//     </DialogRoot>
//   );
// }
