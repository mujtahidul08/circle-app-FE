import DialogThread from '@/components/dialogThread';
import { Box } from '@chakra-ui/react';
import Thread from '@/components/thread';

export default function Home() {
  return (
    <Box>
      <Box flex="5" height="100vh" overflowY="auto" scrollBehavior="smooth" scrollbar="hidden" w="full" >
        <h3 className="text-3xl text-white p-3 font-medium">Home</h3>
        <DialogThread />
        <Thread  />
      </Box>
    </Box>
  );
}
