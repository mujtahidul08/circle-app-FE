import { useEffect, useState } from "react";
import { Box, Tabs, Text } from "@chakra-ui/react";
import useUserStore from "@/hooks/store/userStore";
import { apiURL } from "@/utils/baseurl";
import axios from "axios";
import { userType } from "@/types/user.types";
import { useParams } from "react-router-dom";
import ProfileAccount from "@/components/profileAccount";
import ThreadByAccount from "@/components/threadByAccount";
import ImageByAccount from "@/components/imageByAccount";
import useFollowStore from "@/hooks/store/followStore";

export default function PageProfileAccount() {
  const { token } = useUserStore(); // Ambil token dari global state
  const { authorId } = useParams<{ authorId: string }>();
  const [profileData, setProfileData] = useState<userType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { updateCounts } = useFollowStore(); // Import updateCounts dari followStore

  useEffect(() => {
    // Ambil data profil user berdasarkan `authorId`
    fetchProfileData();
  }, [authorId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiURL}api/profile/${authorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Profile data:", response.data);
      setProfileData(response.data);

      // Update jumlah followers dan following setelah profil berhasil dimuat
      updateCounts();
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
      ) : profileData ? (
        <>
          <h3 className="text-3xl text-white p-3 font-medium">
            {profileData.username}
          </h3>
          <ProfileAccount user={profileData} />
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
              {authorId ? (
                <ThreadByAccount authorId={authorId} />
              ) : (
                <Text>No authorId</Text>
              )}
            </Tabs.Content>
            <Tabs.Content value="image" mt="0">
              {authorId ? (
                <ImageByAccount authorId={authorId} />
              ) : (
                <Text>No authorId</Text>
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

