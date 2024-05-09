import { Avatar, Button, Flex, Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useNavigate } from "react-router-dom";
const SuggestedUser = ({ user }) => {
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  const navigate = useNavigate();
  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
      <Flex
        gap={2}
        cursor={"pointer"}
        onClick={() => navigate(`/${user.username}`)}
      >
        <Avatar src={user.profilePic} />
        <Box>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.username}
          </Text>
          <Text color={"gray.light"} fontSize={"sm"}>
            {user.name}
          </Text>
        </Box>
      </Flex>
      <Button
        size={"sm"}
        color={following ? "black" : "white"}
        bg={following ? "gray.300" : "blue.400"}
        onClick={handleFollowUnfollow}
        isLoading={updating}
        _hover={{
          color: following ? "black" : "white",
          opacity: 0.8,
        }}
      >
        {following ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;
