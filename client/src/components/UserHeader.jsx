import React, { useState } from "react";
import {
  VStack,
  Flex,
  Avatar,
  Text,
  Box,
  Link,
  MenuButton,
  Menu,
  Portal,
  MenuList,
  MenuItem,
  useToast,
  Button,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsInstagram, BsLinkedin } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import UserDetails from "./UserDetails";
const UserHeader = ({ user }) => {
  const toast = useToast();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Copy Link",
        status: "success",
        description: "Profile link copied to clipboard",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  if (!user) return <h1>Hello</h1>;
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Flex alignItems={"center"} gap={2}>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              {user.name}
            </Text>
            {user.isVerified && (
              <Image src="/verified.png" w={6} h={6} ml={1} />
            )}
          </Flex>
          <Flex alignItems={"center"} gap={2}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Text
              bg={useColorModeValue("gray.400", "gray.800")}
              fontSize={"xs"}
              p={1}
              borderRadius={"full"}
            >
              CampusAura
            </Text>
          </Flex>
        </Box>
        {user.profilePic ? (
          <Box>
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{ base: "md", md: "lg", lg: "xl" }}
            />
          </Box>
        ) : (
          <Box>
            <Avatar
              name={user.name}
              src={"https://bit.ly/broken-link"}
              size={{ base: "md", md: "lg", lg: "xl" }}
            />
          </Box>
        )}
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex alignItems={"center"} gap={2}>
          <Text color={"gray.light"}>
            {user.followers.length + (following ? 1 : 0)} followers
          </Text>
          <Box w={1} h={1} bg={"gray.dark"} borderRadius={"full"}></Box>
          <Link>CampusAura.com</Link>
        </Flex>
        <Flex gap={2}>
          {user.linkedIn && (
            <Box className="icon-container">
              <a href={user.linkedIn}>
                <BsLinkedin size={24} cursor={"pointer"} />
              </a>
            </Box>
          )}
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem onClick={copyUrl}>Copy Link</MenuItem>
                  {currentUser.type === "faculty" && (
                    <MenuItem>
                      <UserDetails viewUser={user} />
                    </MenuItem>
                  )}
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Posts</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
