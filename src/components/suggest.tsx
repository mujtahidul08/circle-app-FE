import { toggleFollow } from "@/features/dashboard/services/profile.services";
import useFollowStore from "@/hooks/store/followStore";
import useUserStore from "@/hooks/store/userStore";
// import useSuggestedUserStore from "@/hooks/store/suggestedUserStore";
import { Box, Button, HStack, Image, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function Suggest() {
  const { suggestedUsers, toggleFollow } = useFollowStore();
  const { token } = useUserStore();
  const [loading, setLoading] = useState(false);

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return <Text color="white">No suggested users available</Text>;
  }

  console.log("suggested user",suggestedUsers)

  const handleFollowToggle = async (userId: number) => {
    if (!token) {
      console.error("Token is missing");
      return;
    }
    setLoading(true);
    try {
      await toggleFollow(userId, token);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding="10px" bgColor="#262626" borderRadius="10px" mb="5px" h="400px" overflowY="auto" scrollBehavior="smooth" scrollbar="hidden" w="full" >
      <h3 className="text-lg text-white mb-2">Suggested for you</h3>
      {suggestedUsers.map((account) => (
        <HStack align="center" justifyContent="space-between" width="100%" mb="15px" key={account.id}>
          <HStack align="center">
            <Link href={`/profile/${account.id}`}>
              <Image
                src={account.avatar|| "https://bit.ly/naruto-sage"}
                boxSize="40px"
                borderRadius="full"
                fit="cover"
              />
              <VStack align="left" marginLeft="3" spaceY="-1">
                <Text fontWeight="medium" textStyle="sm" color="white">
                  {account.username}
                </Text>
                <Text color="#909090" textStyle="xs">
                  {account.email}
                </Text>
              </VStack>
            </Link>
          </HStack>
          {account.isFollowed? (
            <Button
              borderRadius="30px"
              padding="8px"
              borderWidth="1px"
              height="30px"
              color="#909090"
              textStyle="xs"
              onClick={() => handleFollowToggle(account.id)}
            >
              Following
            </Button>
          ) : (
            <Button
              borderRadius="30px"
              padding="8px"
              borderWidth="1px"
              height="30px"
              color="white"
              textStyle="xs"
              onClick={() => handleFollowToggle(account.id)}
            >
              Follow
            </Button>
          )}
        </HStack>
      ))}
    </Box>
  );
}
