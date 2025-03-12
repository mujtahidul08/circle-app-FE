import { Box, Input, Spinner, VStack, Text, HStack, Image, Stack, Button, Link } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import useFollowStore from "@/hooks/store/followStore";

export default function CompSearch() {
  const [query, setQuery] = useState<string>(""); 
  const [searchResults, setSearchResults] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const { following, toggleFollow } = useFollowStore();
  const apiURL = import.meta.env.VITE_API_URL
  // Fetch search results
  const fetchSearchResults = async (searchQuery: string) => {
    setIsLoading(true);

    try {
      const response = await axios.get(apiURL+"api/search", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
        params: { q: searchQuery }, 
      });

      // Update results and check follow status from `followStore`
      const updatedResults = response.data.results.map((user: any) => ({
        ...user,
        isFollow: following.some((followedUser) => followedUser.id === user.id),
      }));

      setSearchResults(updatedResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSearchResults([]);
    } else {
      fetchSearchResults(value);
    }
  };

  // Handle Follow/Unfollow
  const handleFollowClick = async (userId: number) => {
    try {
      await toggleFollow(userId, localStorage.getItem("token")!); // Use `toggleFollow` from store

      // Update local results to reflect follow/unfollow change
      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === userId ? { ...user, isFollow: !user.isFollow } : user
        )
      );
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <Box position="relative" width="100%" p="3" >
      {/* Input Field */}
      <Input
        placeholder="Search your friends"
        paddingLeft="50px"
        color="white"
        borderRadius="20px"
        borderWidth="1px"
        borderColor="#04A51E"
        bgColor="#3F3F3F"
        value={query}
        onChange={handleSearch} 
      />
      {/* Ikon */}
      <Box position="absolute" top="50%" left="20px" transform="translateY(-50%)">
        {/* Icon Placeholder */}
      </Box>

      {/* Loading Indicator */}
      {isLoading && <Spinner color="white" mt="4" />}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <VStack mt="4" align="stretch" w="full">
          {searchResults.map((user) => (
            <HStack align="center" justifyContent="space-between" width="100%" mb="10px" key={user.id}>
              <Link href={`/profile/${user.id}`}>
                <HStack spaceX="2" align="center">
                  <Image
                    src={user.profile?.avatarImage || "https://bit.ly/naruto-sage"}
                    boxSize="40px"
                    borderRadius="full"
                    fit="cover"
                  />
                  <Stack spaceY="-1.5">
                    <Text fontWeight="medium" textStyle="sm" color="white">
                      {user.username}
                    </Text>
                    <Text color="#909090" textStyle="xs">{user.email}</Text>
                  </Stack>
                </HStack>
              </Link>

              <Button
                borderRadius="30px"
                padding="8px"
                borderWidth="1px"
                height="30px"
                color={user.isFollow ? "#909090" : "white"}
                textStyle="xs"
                onClick={() => handleFollowClick(user.id)} // Use handleFollowClick
              >
                {user.isFollow ? "Following" : "Follow"}
              </Button>
            </HStack>
          ))}
        </VStack>
      )}
      {query.trim() !== "" && searchResults.length === 0 && !isLoading && (
        <Text color="white" mt="4" w="full" h="full" display="flex" justifyContent="center" alignItems="center">
          No results found.
        </Text>
      )}
    </Box>
  );
}
