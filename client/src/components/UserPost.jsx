import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Flex, Avatar, Box, Text, Image } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
const UserPost = ({ likes, comments, postImg, postTitle }) => {
  const [liked, setLiked] = useState(false);
  return (
    <Link to={"/markzuckerberg/post/1"}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            name={"Mark Zuckerberg"}
            src={"/zuck-avatar.png"}
            size={"md"}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              name={"Mark Zuckerberg"}
              src={"https://bit.ly/kent-c-dodds"}
              size={"xs"}
              position={"absolute"}
              top={5}
              left={"15px"}
              padding={"2px"}
            />
            <Avatar
              name={"Mark Zuckerberg"}
              src={"https://bit.ly/dan-abramov"}
              size={"xs"}
              position={"absolute"}
              top={0}
              left={"5px"}
              padding={"2px"}
            />
            <Avatar
              name={"Mark Zuckerberg"}
              src={"https://bit.ly/dan-abramov"}
              size={"xs"}
              position={"absolute"}
              top={0}
              left={"25px"}
              padding={"2px"}
            />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                markzuckerberg
              </Text>
              {user?.isVerified && (
                <Image src="/verified.png" w={4} h={4} ml={1} />
              )}
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{postTitle}</Text>
          {postImg && (
            <Box
              position={"relative"}
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={postImg} w={"full"} />
            </Box>
          )}
          <Actions liked={liked} setLiked={setLiked} />
          <Flex alignItems={"center"} gap={2}>
            <Text color={"gray.light"} fontSize={"sm"}>
              {comments} comments
            </Text>
            <Box w={1} h={1} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>
              {likes + (liked ? 1 : 0)} likes likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
