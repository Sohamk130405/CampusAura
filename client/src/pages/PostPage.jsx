import React, { useEffect, useState } from "react";
import {
  Flex,
  Avatar,
  Box,
  Text,
  Image,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import Comment from "../components/Comment";
import Actions from "../components/Actions";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { formatDistanceToNow } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postAtom from "../atoms/postAtom";
const PostPage = () => {
  const { loading, user } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postAtom);
  const post = posts[0];
  const { pid } = useParams();
  const [fetchingPost, setFetchingPost] = useState(true);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are You sure you want to delete this post?")) return;
      const res = await axios.delete(`/api/posts/${pid}`);
      showToast("Success", "Post deleted successfully!", "success");
      navigate(`/${user.username}`);
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
    const getPost = async () => {
      setPosts([]);
      setFetchingPost(true);
      try {
        const res = await axios.get(`/api/posts/${pid}`);
        setPosts([res.data]);
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
      } finally {
        setFetchingPost(false);
      }
    };
    getPost();
  }, [pid, setPosts]);
  if (!user && loading)
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  if (!user && !loading) {
    return (
      <Text textAlign={"center"}>
        User not found! Or may be there account is frozen
      </Text>
    );
  }
  if (!post) {
    return <h1>Post not found!</h1>;
  }
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar name={user.name} src={user.profilePic} size={"md"} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            {user?.isVerified && (
              <Image src="/verified.png" w={4} h={4} ml={1} />
            )}
          </Flex>
        </Flex>
        {fetchingPost && !post && (
          <Flex justifyContent={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
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
            <DeleteIcon onClick={handleDelete} cursor={"pointer"} />
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
      <Divider my={4} />
      {!currentUser && (
        <Flex justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"2xl"}>👋</Text>
            <Text color={"gray.light"}>Login to like,comment and post.</Text>
          </Flex>
          <Button onClick={() => navigate("/auth")}>Login</Button>
        </Flex>
      )}

      {post.comments.map((comment) => (
        <Comment
          comment={comment}
          key={comment._id}
          lastComment={
            comment._id === post.comments[post.comments.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
