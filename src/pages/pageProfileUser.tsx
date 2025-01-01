import { useEffect, useState } from "react";
import { Box, Tabs, Text } from "@chakra-ui/react";
import ThreadByUser from "@/components/threadByUser";
import useUserStore from "@/hooks/userStore";
import { apiURL } from "@/utils/baseurl";
import axios from "axios";
import ProfileUser from "@/components/profileUser";
import { userType } from "@/types/user.types";

export default function PageProfileUser() {
  const { token } = useUserStore(); // Ambil token dari global state
  const [profileData, setProfileData] = useState<userType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Ambil data profil user yang sedang login
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiURL + `api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response.data); // Simpan data user ke state
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading ? (
        <Text color="white" w="full" h="full" display="flex" justifyContent="center" alignItems="center">Loading...</Text>
      ) : profileData ? (
        <>
          <h3 className="text-3xl text-white p-3 font-medium">
            {profileData.username}
          </h3>
          <ProfileUser user={profileData} /> {/* Pass profileData ke komponen */}
          <Tabs.Root defaultValue="post">
            <Tabs.List display="flex" borderBottom="1px solid #3F3F3F">
              <Tabs.Trigger
                value="post"
                _selected={{
                  borderBottom: "3px solid #04A51E",
                  color: "white",
                }}
                _hover={{ borderBottom: "3px solid #3F3F3F" }}
                flex="1"
                display="flex"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p="2"
                color="whiteAlpha.800"
              >
                Post
              </Tabs.Trigger>
              <Tabs.Trigger
                value="image"
                _selected={{
                  marginX: "3",
                  borderBottom: "3px solid #04A51E",
                  color: "white",
                }}
                _hover={{ borderBottom: "3px solid #3F3F3F" }}
                flex="1"
                display="flex"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p="2"
                color="whiteAlpha.800"
              >
                Image
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="followers" mt="4">
              {token ? <ThreadByUser token={token} />:<p className="text-white">Token not found</p>}
            </Tabs.Content>
            <Tabs.Content value="following" mt="4">

            </Tabs.Content>
          </Tabs.Root>
        </>
      ) : (
        <p className="text-white">User not found</p>
      )}
    </Box>
  );
}


// export default function PageProfileUser() {
//     const { username } = useParams(); // Ambil username dari URL
//     const { user, token } = useUserStore(); // Ambil user dan token dari state global
//     const [profileData, setProfileData] = useState(null);
//     const [loading, setLoading] = useState<boolean>(true);
    
//     const isOwnProfile = user?.username === username;

//     useEffect(() => {
//       if (username) {
//         // Ambil data profil pengguna berdasarkan username
//         fetchProfileData(username);
//       }
//     }, [username]);
  
//     const fetchProfileData = async (username: string) => {
//       try {
//         setLoading(true);
        
//         // Kirim request dengan Authorization header
//         const response = await axios.get(apiURL+`api/users/${username}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`, // Menambahkan token di header
//           },
//         });

//         setProfileData(response.data); // Menyimpan data profil
//       } catch (error) {
//         console.error("Failed to fetch profile data", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     const displayUser = isOwnProfile ? user : profileData;
//     return (
//       <Box>
//         {displayUser && (
//           <>
//             <h3 className="text-3xl text-white p-3 font-medium">
//               {isOwnProfile ? user?.username : displayUser.username}
//             </h3>
//             <ProfileAccount user={displayUser} />
  
//             {/* Tabs untuk konten profil */}
//             <Tabs.Root defaultValue="post">
//             <Tabs.List display="flex" borderBottom="1px solid #3F3F3F">
//             <Tabs.Trigger
//                 value="post"
//                 _selected={{
//                 borderBottom: "3px solid #04A51E",
//                 color: "white",
//                 }}
//                 _hover={{ borderBottom: "3px solid #3F3F3F" }}
//                 flex="1"
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 textAlign="center"
//                 p="2"
//                 color="whiteAlpha.800"
//             >
//                 Post
//             </Tabs.Trigger>
//             <Tabs.Trigger
//                 value="image"
//                 _selected={{
//                 marginX:"3",
//                 borderBottom: "3px solid #04A51E",
//                 color: "white",
//                 }}
//                 _hover={{ borderBottom: "3px solid #3F3F3F" }}
//                 flex="1"
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 textAlign="center"
//                 p="2"
//                 color="whiteAlpha.800"
                
//             >
//                 Image
//             </Tabs.Trigger>
//             </Tabs.List>

//             {/* Tabs Content */}
//             <Tabs.Content value="followers" mt="4">
//             <ThreadByUser/>
//             </Tabs.Content>
//             <Tabs.Content value="following" mt="4">
            
//             </Tabs.Content>
//         </Tabs.Root>
//           </>
//         )}
//       </Box>
//     );
//   }

// export default function Profile(){
//     const { username } = useParams(); // Ambil username dari URL
//     const { user } = useUserStore();
//     const isOwnProfile = user?.username === username;
//     return(
//         <>
//             <h3 className="text-3xl text-white p-3 font-medium">{isOwnProfile ? user?.username : username}</h3>
//             <ProfileAccount/>
        //   <Tabs.Root defaultValue="post">
        //     <Tabs.List display="flex" borderBottom="1px solid #3F3F3F">
        //     <Tabs.Trigger
        //         value="post"
        //         _selected={{
        //         borderBottom: "3px solid #04A51E",
        //         color: "white",
        //         }}
        //         _hover={{ borderBottom: "3px solid #3F3F3F" }}
        //         flex="1"
        //         display="flex"
        //         justifyContent="center"
        //         alignItems="center"
        //         textAlign="center"
        //         p="2"
        //         color="whiteAlpha.800"
        //     >
        //         Post
        //     </Tabs.Trigger>
        //     <Tabs.Trigger
        //         value="image"
        //         _selected={{
        //         marginX:"3",
        //         borderBottom: "3px solid #04A51E",
        //         color: "white",
        //         }}
        //         _hover={{ borderBottom: "3px solid #3F3F3F" }}
        //         flex="1"
        //         display="flex"
        //         justifyContent="center"
        //         alignItems="center"
        //         textAlign="center"
        //         p="2"
        //         color="whiteAlpha.800"
                
        //     >
        //         Image
        //     </Tabs.Trigger>
        //     </Tabs.List>

        //     {/* Tabs Content */}
        //     <Tabs.Content value="followers" mt="4">
        //     <ThreadByUser/>
        //     </Tabs.Content>
        //     <Tabs.Content value="following" mt="4">
            
        //     </Tabs.Content>
        // </Tabs.Root>
//             <Post/>
//         </>
//     )
// }

// export default function Profile(){
//     const { username } = useParams(); // Ambil username dari URL
//     const { user } = useUserStore();
//     const isOwnProfile = user?.username === username;
//     return(
//         <>
//             <h3 className="text-3xl text-white p-3 font-medium">{user.username}</h3>
//             <ProfileAccount/>
//           <Tabs.Root defaultValue="post">
//             <Tabs.List display="flex" borderBottom="1px solid #3F3F3F">
//             <Tabs.Trigger
//                 value="post"
//                 _selected={{
//                 borderBottom: "3px solid #04A51E",
//                 color: "white",
//                 }}
//                 _hover={{ borderBottom: "3px solid #3F3F3F" }}
//                 flex="1"
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 textAlign="center"
//                 p="2"
//                 color="whiteAlpha.800"
//             >
//                 Post
//             </Tabs.Trigger>
//             <Tabs.Trigger
//                 value="image"
//                 _selected={{
//                 marginX:"3",
//                 borderBottom: "3px solid #04A51E",
//                 color: "white",
//                 }}
//                 _hover={{ borderBottom: "3px solid #3F3F3F" }}
//                 flex="1"
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 textAlign="center"
//                 p="2"
//                 color="whiteAlpha.800"
                
//             >
//                 Image
//             </Tabs.Trigger>
//             </Tabs.List>

//             {/* Tabs Content */}
//             <Tabs.Content value="followers" mt="4">
//             <ThreadByUser/>
//             </Tabs.Content>
//             <Tabs.Content value="following" mt="4">
            
//             </Tabs.Content>
//         </Tabs.Root>
//             <Post/>
//         </>
//     )
// }