import { Box, HStack, Image, Link, Stack, Text } from '@chakra-ui/react';
import DialogEditProfile from './dialogEditProfile';
import useUserStore from '@/hooks/store/userStore';
import useFollowStore from '@/hooks/store/followStore';

export default function ProfileUser({ user }: { user: any }) {
  const { followersCount, followingCount } = useFollowStore();
  

  return (
    <Box padding="10px" bgColor="#262626" borderRadius="10px" mb="5px">
      <h3 className="text-lg text-white mb-2">My Profile</h3>
      <Box mb="7" style={{ position: "relative", width: "100%" }}>
        <Image
          src={user?.profile?.backgroundImage  || "https://plus.unsplash.com/premium_photo-1701534008693-0eee0632d47a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D"}
          height="70px"
          width="100%"
          borderRadius="10px"
        />
        <Image
          src={user?.profile?.avatarImage || "https://bit.ly/naruto-sage"}
          boxSize="48px"
          borderRadius="full"
          style={{
            position: "absolute",
            top: "47px",
            left: "10px",
          }}
        />
        <DialogEditProfile user={user} />
      </Box>
      <Stack gap="0">
        <Text fontWeight="medium" textStyle="sm" color="white">
          {user?.username}
        </Text>
        <Text color="#909090" textStyle="xs">
          {user?.email}
        </Text>
      </Stack>
      <Text textStyle="sm" color="white">
        {user?.profile?.bio || "No bio available"}
      </Text>
      <HStack>
        <HStack>
          <Text fontWeight="medium" textStyle="xs" color="white">
            {followersCount}
          </Text>
          <Text color="#909090" textStyle="xs">
            Followers
          </Text>
        </HStack>
        <HStack>
          <Text fontWeight="medium" textStyle="xs" color="white">
            {followingCount}
          </Text>
          <Text color="#909090" textStyle="xs">
            Following
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
}
// export default function ProfileUser({ user }: { user: any }) {
//   return (
//     <>
//       <Box padding="10px" bgColor="#262626" borderRadius="10px" mb="5px">
      
//         <h3 className="text-lg text-white mb-2">My Profile</h3>
//         <div className="mb-7" style={{ position: "relative", width: "100%" }}>
//           <Image
//             src={user?.profile?.backgroundImage || "https://plus.unsplash.com/premium_photo-1701534008693-0eee0632d47a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D"}
//             height="70px"
//             width="100%"
//             borderRadius="10px"
//             style={{ position: "relative", zIndex: 1 }}
//           />
//           <Image
//             src={user?.profile?.avatarImage || "https://bit.ly/naruto-sage"}
//             boxSize="48px"
//             borderRadius="full"
//             fit="cover"
//             style={{
//               position: "absolute",
//               top: "47px",
//               left: "10px",
//               zIndex: 2,
//             }}
//           />
//           <DialogEditProfile user={user} />
//         </div>
//         <Link href='/profile'>
//         <Stack gap="0">
//           <Text fontWeight="medium" textStyle="sm" color="white">
//             {user?.username}
//           </Text>
//           <Text color="#909090" textStyle="xs">
//             {user?.email}
//           </Text>
//         </Stack>
//         </Link>

//         <Text textStyle="sm" color="white" truncate>
//           {user?.profile?.bio || "No bio available"}
//         </Text>

//         <HStack>
//           <HStack>
//             <Text fontWeight="medium" textStyle="xs" color="white">
//             {user?.follower?.length || 0}
//             </Text>
//             <Text color="#909090" textStyle="xs">
//               Following
//             </Text>
//           </HStack>
//           <HStack>
//             <Text fontWeight="medium" textStyle="xs" color="white">
//             {user?.following?.length || 0}
//             </Text>
//             <Text color="#909090" textStyle="xs">
//               Followers
//             </Text>
//           </HStack>
//         </HStack>
        
//       </Box>
//     </>
//   );
// }
