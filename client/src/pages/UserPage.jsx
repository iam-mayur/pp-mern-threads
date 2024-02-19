import UserHeader from "../components/UserHeader";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";

const UserPage = () => {
  return (
    <>
      <UserHeader />

      <Flex justifyContent={"center"} my={12}>
        <Spinner size={"xl"} />
      </Flex>

      <Post />
    </>
  );
};

export default UserPage;
