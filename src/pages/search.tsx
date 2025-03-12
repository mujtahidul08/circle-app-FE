import CompSeacrh from "@/components/compSeacrh";
import { Box} from "@chakra-ui/react";


export default function Search(){
    return(
        <>
        <Box height="100vh" display="flex" flexDirection="column"> 
            <Box display="flex" justifyContent="start">
                <CompSeacrh/>
            </Box>
        </Box>
        </>
    )
}