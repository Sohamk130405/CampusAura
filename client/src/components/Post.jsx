import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flex, Avatar, Box, Text, Image } from "@chakra-ui/react";
import Actions from "./Actions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import useShowToast from "../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postAtom);
  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are You sure you want to delete this post?")) return;
      const res = await axios.delete(`/api/posts/${post._id}`);
      setPosts(posts.filter((p) => p._id !== post._id));

      showToast("Success", "Post deleted successfully!", "success");
    } catch (error) {
      console.log(error);
      // If the error is from the server (e.g., network error, 500 Internal Server Error)
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        showToast("Error", errorMessage, "error");
      } else {
        // If the error object does not contain the expected structure
        showToast(
          "Error",
          "An error occurred. Please try again later.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${postedBy}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
        // If the error is from the server (e.g., network error, 500 Internal Server Error)
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          const errorMessage = error.response.data.error;
          showToast("Error", errorMessage, "error");
        } else {
          // If the error object does not contain the expected structure
          showToast(
            "Error",
            "An error occurred. Please try again later.",
            "error"
          );
        }
      }
    };
    getUser();
  }, [postedBy, showToast]);
  if (!user) return null;
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            name={user.name}
            src={user.profilePic}
            size={"md"}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.comments.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.comments[0] && (
              <Avatar
                name={post.comments[0].username}
                src={post.comments[0].userProfilePic}
                size={"xs"}
                position={"absolute"}
                top={5}
                left={"15px"}
                padding={"2px"}
              />
            )}
            {post.comments[1] && (
              <Avatar
                name={post.comments[1].username}
                src={post.comments[1].userProfilePic}
                size={"xs"}
                position={"absolute"}
                top={0}
                left={"5px"}
                padding={"2px"}
              />
            )}
            {post.comments[2] && (
              <Avatar
                name={post.comments[2].username}
                src={post.comments[2].userProfilePic}
                size={"xs"}
                position={"absolute"}
                top={0}
                left={"25px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user.username}
              </Text>
              {user?.isVerified && (
                <Image src="/verified.png" w={4} h={4} ml={1} />
              )}
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                color={"gray.light"}
                width={36}
                textAlign={"right"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser && currentUser?._id === user._id && (
                <DeleteIcon onClick={handleDelete} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              position={"relative"}
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}
          <Actions post={post} postedBy={user} />
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
