import { useEffect, useState } from "react";
import { Box, Tabs, Text } from "@chakra-ui/react";
import ThreadByUser from "@/components/threadByUser";
import useUserStore from "@/hooks/store/userStore";
import axios from "axios";
import ProfileUser from "@/components/profileUser";
import ImageByUser from "@/components/imageByUser";

export default function PageProfileUser() {
  const { token, user, fetchProfile } = useUserStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      await fetchProfile(token!); // Memastikan token tidak null
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading ? (
        <Text
          color="white"
          w="full"
          h="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          Loading...
        </Text>
      ) : user ? (
        <>
          <h5 className="text-3xl text-white p-3 font-medium">
          </h5>
          <ProfileUser user={user} />
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
            <Tabs.Content value="post" mt="0">
            {token ? (
              <ThreadByUser token={token} user={user} />
            ) : (
              <p className="text-white">Token not found</p>
            )}
            </Tabs.Content>
            <Tabs.Content value="image" mt="0">
              {token ? (
                <ImageByUser token={token} />
              ) : (
                <p className="text-white">Token not found</p>
              )}
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
//   const { token } = useUserStore(); // Ambil token dari global state
//   const [profileData, setProfileData] = useState<userType | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     // Ambil data profil user yang sedang login
//     fetchProfileData();
//   }, []);

  // const fetchProfileData = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(apiURL + `api/profile`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log("Profile data:", response.data);
  //     setProfileData(response.data); // Simpan data user ke state
  //   } catch (error) {
  //     console.error("Failed to fetch profile data", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   return (
//     <Box>
//       {loading ? (
//         <Text color="white" w="full" h="full" display="flex" justifyContent="center" alignItems="center">Loading...</Text>
//       ) : profileData ? (
//         <>
//           <h3 className="text-3xl text-white p-3 font-medium">
//             {profileData.username}
//           </h3>
//           <ProfileUser user={profileData} /> {/* Pass profileData ke komponen */}
//           <Tabs.Root defaultValue="post">
//             <Tabs.List display="flex" borderBottom="1px solid #3F3F3F">
//               <Tabs.Trigger
//                 value="post"
//                 _selected={{
//                   borderBottom: "3px solid #04A51E",
//                   color: "white",
//                 }}
//                 _hover={{ borderBottom: "3px solid #3F3F3F" }}
//                 flex="1"
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 textAlign="center"
//                 p="2"
//                 color="whiteAlpha.800"
//               >
//                 Post
//               </Tabs.Trigger>
//               <Tabs.Trigger
//                 value="image"
//                 _selected={{
//                   marginX: "3",
//                   borderBottom: "3px solid #04A51E",
//                   color: "white",
//                 }}
//                 _hover={{ borderBottom: "3px solid #3F3F3F" }}
//                 flex="1"
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 textAlign="center"
//                 p="2"
//                 color="whiteAlpha.800"
//               >
//                 Image
//               </Tabs.Trigger>
//             </Tabs.List>
//             <Tabs.Content value="post" mt="0">
//               {token ? <ThreadByUser token={token} />:<p className="text-white">Token not found</p>}
//             </Tabs.Content>
//             <Tabs.Content value="image" mt="0">
//             {token ? <ImageByUser token={token} />:<p className="text-white">Token not found</p>}
//             </Tabs.Content>
//           </Tabs.Root>
//         </>
//       ) : (
//         <p className="text-white">User not found</p>
//       )}
//     </Box>
//   );
// }

