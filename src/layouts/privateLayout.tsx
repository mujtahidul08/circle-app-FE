import { Outlet} from "react-router-dom"
import { Box, HStack, VStack } from "@chakra-ui/react";
import SideBar from "@/components/sideBar";
import Suggest from "@/components/suggest";
import ProfileUser from "@/components/profileUser";
// import { SuggestedUserProvider } from "@/hooks/contexts/suggestedUserContext";
import { useEffect, useState } from "react";
import useUserStore from "@/hooks/store/userStore";
import useFollowStore from "@/hooks/store/followStore";
import { fetchFollowers, fetchFollowing } from "@/features/dashboard/services/profile.services";
import { ChakraProvider } from '@chakra-ui/react';


export default function PrivateLayout() {
  const { fetchSuggestedUsers, updateCounts,updateFollowers,updateFollowing} = useFollowStore();
  const [loadingSuggestedUsers, setLoadingSuggestedUsers] = useState(true);
  const { token, user, fetchProfile } = useUserStore();
  

  useEffect(() => {
    const loadSuggestedUsers = async () => {
      try {
        if (!token) {
          console.error("No token found, user is not authenticated");
          return;
        }
        await fetchProfile(token!)
        await fetchSuggestedUsers(); 
        const fetchedFollowers = await fetchFollowers(token);
        console.log("Fetched Followers:", fetchedFollowers);
        updateFollowers(fetchedFollowers); // Update followers di store
        const fetchedFollowing = await fetchFollowing(token);
        updateFollowing(fetchedFollowing)
        updateCounts()// Pastikan jumlah followers dan following diperbarui setelah data fetch
        
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoadingSuggestedUsers(false);
      }
    };

    loadSuggestedUsers();
  }, [token, updateFollowers, updateFollowing,updateCounts, fetchSuggestedUsers,fetchProfile]);

  return (
    <>
      <HStack gap="0" m="0" p="0" w="full" h="full">
        {/* Sidebar */}
        <Box
          flex="2"
          height="100vh"
          borderRightWidth="1px"
          borderColor="#3F3F3F"
          position="sticky"
          top="0"
          left="0"
          overflow="auto"
        >
          <SideBar />
        </Box>

        {/* Main Content */}
        <Box flex="5" height="100vh" overflowY="auto" scrollbar="hidden" scrollBehavior="smooth">
          <main>
            <Outlet />
          </main>
        </Box>

        {/* Right Profile */}
        <Box
          flex="3"
          height="100vh"
          p="4"
          borderLeftWidth="1px"
          borderColor="#3F3F3F"
          position="sticky"
          top="0"
        >
          <VStack align="stretch">
            {user && <ProfileUser user={user} />} 
            <Suggest/>
          </VStack>
        </Box>
      </HStack>
      
    </>
  );
}