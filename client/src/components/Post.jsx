import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { DeleteIcon } from "@chakra-ui/icons";

const Post = () => {
  return (
    <Link to={`/home`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size="md" name={username} src={Image.png} />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size="xs"
              name="John doe"
              src={Image.png}
              position={"absolute"}
              top={"0px"}
              left="15px"
              padding={"2px"}
            />

            <Avatar
              size="xs"
              name="John doe"
              src={Image.png}
              position={"absolute"}
              bottom={"0px"}
              right="-5px"
              padding={"2px"}
            />

            <Avatar
              size="xs"
              name="John doe"
              src={Image.png}
              position={"absolute"}
              bottom={"0px"}
              left="4px"
              padding={"2px"}
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                username
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                1d ago
              </Text>

              <DeleteIcon size={20} />
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>Post text</Text>

          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src={Image.png} w={"full"} />
          </Box>
          <Flex gap={3} my={1}>
            <Actions />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
