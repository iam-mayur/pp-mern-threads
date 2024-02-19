import { Avatar, Button, Divider, Flex, Image, Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { DeleteIcon } from "@chakra-ui/icons";
const PostPage = () => {
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={zuck - avatar.png} size={"md"} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              username
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
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

          <DeleteIcon size={20} cursor={"pointer"} />
        </Flex>
      </Flex>
      <Text my={3}>Post text</Text>
      //Code for post image here
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      //Comments here
    </>
  );
};

export default PostPage;
