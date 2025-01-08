import { useEffect, useState } from "react";
import { Button, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";
// import { Follower } from "@/types/profile.types";
import { fetchFollowing } from "@/features/dashboard/services/profile.services";
// import useUserStore from "@/hooks/store/userStore";
import useFollowStore from "@/hooks/store/followStore";

interface FollowingProps {
  token: string | null;
}

export default function Following({ token }: FollowingProps) {
  const { following, updateFollowing, toggleFollow,updateCounts } = useFollowStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFollowing = async () => {
      if (!token) {
        console.error("No token found, user is not authenticated");
        return;
      }

      try {
        setLoading(true);
        const fetchedFollowing = await fetchFollowing(token);
        updateFollowing(fetchedFollowing); // Memperbarui following di store
        console.log("following:",fetchedFollowing);
        updateCounts();  // Memperbarui count followers dan following
      } catch (error) {
        console.error("Error fetching following:", error);
      } finally {
        setLoading(false);
      }
    };

    getFollowing();
  }, [token, updateFollowing, updateCounts]);

  const handleToggleFollow = async (id: number) => {
    if (!token) {
      console.error("No token found, unable to toggle follow.");
      return;
    }

    await toggleFollow(id, token); // Gunakan fungsi toggleFollow dari store
  };

  if (loading) return <Text>Loading...</Text>;

  if (following.length === 0) {
    return (
      <Text fontSize="lg" color="white" textAlign="center" mt="5">
        You currently have no following. Share your profile to grow your network!
      </Text>
    );
  }

  return (
    <>
      {following.map((account, index) => (
        <HStack align="center" justifyContent="space-between" width="100%" mb="10px" key={index}>
          <Link href={`/profile/${account.id}`}>
            <HStack align="center">
              <Image
                src={account.image || "https://bit.ly/naruto-sage"}
                boxSize="40px"
                borderRadius="full"
                fit="cover"
              />
              <Stack marginLeft="2" spaceY="-1">
                <Text fontWeight="medium" textStyle="sm" color="white">
                  {account.username}
                </Text>
                <Text color="#909090" textStyle="xs">
                  {account.email}
                </Text>
              </Stack>
            </HStack>
          </Link>
          <Button
            onClick={() => handleToggleFollow(account.id)}
            borderRadius="30px"
            padding="8px"
            borderWidth="1px"
            height="30px"
            color={account.isFollowed ? "#909090" : "white"}
            textStyle="xs"
          >
            {account.isFollowed ? "Following" : "Follow"}
          </Button>
        </HStack>
      ))}
    </>
  );
}

