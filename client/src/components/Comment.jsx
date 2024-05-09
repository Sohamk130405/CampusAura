import React from "react";
import { Flex, Avatar, Text, Divider } from "@chakra-ui/react";

const Comment = ({ comment, lastComment }) => {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar
          name={comment.username}
          src={comment.userProfilePic}
          size={"sm"}
        />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {comment.username}
            </Text>
          </Flex>
          <Text>{comment.text}</Text>
        </Flex>
      </Flex>
      {!lastComment && <Divider />}
    </>
  );
};

export default Comment;
