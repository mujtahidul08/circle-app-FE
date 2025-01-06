import { useEffect, useState } from "react";
import { Button, HStack, Image, Stack, Text,Link } from "@chakra-ui/react";
// import { Follower } from "@/types/profile.types";
import { fetchFollowers } from "@/features/dashboard/services/profile.services";
// import useUserStore from "@/hooks/store/userStore";
import useFollowStore from "@/hooks/store/followStore";

interface FollowersProps {
  token: string | null;
}

export default function Followers({ token }: FollowersProps) {
  const { followers, updateFollowers, toggleFollow, updateCounts } = useFollowStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFollowers = async () => {
      if (!token) {
        console.error("No token found, user is not authenticated");
        return;
      }

      try {
        setLoading(true);
        const fetchedFollowers = await fetchFollowers(token);
        console.log("Fetched Followers:", fetchedFollowers);
        updateFollowers(fetchedFollowers); // Update followers di store
        updateCounts(); // Update jumlah followers dan following
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setLoading(false);
      }
    };

    getFollowers();
  }, [token, updateFollowers, updateCounts]);

  const handleToggleFollow = async (id: number) => {
    if (!token) {
      console.error("No token found, unable to toggle follow.");
      return;
    }

    await toggleFollow(id, token); // Gunakan fungsi toggleFollow dari store
  };

  if (loading) return <Text>Loading...</Text>;

  if (followers.length === 0) {
    return (
      <Text fontSize="lg" color="white" textAlign="center" mt="5">
        You currently have no followers. Share your profile to grow your network!
      </Text>
    );
  }

  return (
    <>
      {followers.map((account) => (
        <HStack align="center" justifyContent="space-between" width="100%" mb="10px" key={account.id}>
          <Link href={`/profile/${account.id}`}>
            <HStack spaceX="2" align="center">
              <Image
                src={account.image || "/default-avatar.png"}
                boxSize="40px"
                borderRadius="full"
                fit="cover"
              />
              <Stack spaceX="-1.5">
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

// interface FollowersProps {
//   token: string | null;
// }

// export default function Followers({ token }: FollowersProps) {
//   const [followers, setFollowers] = useState<Follower[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   useEffect(() => {
//     const getFollowers = async () => {
//       if (!token) {
//         console.error("No token found, user is not authenticated");
//         return;
//       }
  
//       try {
//         setLoading(true);
//         const fetchedFollowers = await fetchFollowers(token);
//         console.log("Fetched Followers:", fetchedFollowers);
//         setFollowers(fetchedFollowers);
//       } catch (error) {
//         console.error("Error fetching followers:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     getFollowers();
//   }, [token]);

//   const toggleFollow = (id: number) => {
//     const updatedFollowers = followers.map((follower) =>
//       follower.id === id ? { ...follower, isFollow: !follower.isFollow } : follower
//     );
//     setFollowers(updatedFollowers);
//   };

//   if (loading) return <Text>Loading...</Text>;

//   if (followers.length === 0) {
//     return (
//       <Text fontSize="lg" color="white" textAlign="center" mt="5">
//         You currently have no followers. Share your profile to grow your network!
//       </Text>
//     );
//   }
//   return (
//     <>
    
//       {followers.map((account, index) => (
//         <HStack align="center" justifyContent="space-between" width="100%" mb="10px" key={index}>
//           <Link href={`/profile/$${account.id}`}>
//           <HStack spaceX="2" align="center">
//             <Image
//               src={account.image}
//               boxSize="40px"
//               borderRadius="full"
//               fit="cover"
//             />
//             <Stack spaceX="-1.5">
//               <Text fontWeight="medium" textStyle="sm" color="white">
//                 {account.username}
//               </Text>
//               <Text color="#909090" textStyle="xs">
//                 {account.email}
//               </Text>
//             </Stack>
//           </HStack>
//           </Link>
//           {account.isFollow ? (
//             <Button
//               onClick={() => toggleFollow(account.id)}
//               borderRadius="30px"
//               padding="8px"
//               borderWidth="1px"
//               height="30px"
//               color="#909090"
//               textStyle="xs"
//             >
//               Following
//             </Button>
//           ) : (
//             <Button
//               onClick={() => toggleFollow(account.id)}
//               borderRadius="30px"
//               padding="8px"
//               borderWidth="1px"
//               height="30px"
//               color="white"
//               textStyle="xs"
//             >
//               Follow
//             </Button>
//           )}
//         </HStack>
//       ))}
//     </>
//   );
// }
