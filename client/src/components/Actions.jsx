import React, { useState } from "react";
import {
  Flex,
  Box,
  Text,
  Button,
  ModalFooter,
  Input,
  FormControl,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Modal,
  useDisclosure,
  ModalHeader,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import postAtom from "../atoms/postAtom";
const Actions = ({ post, postedBy }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postAtom);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [isLiking, setIsLinking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const showToast = useShowToast();
  const [comment, setComment] = useState("");
  const handleLike = async () => {
    setIsLinking(true);
    if (!user) {
      setIsLinking(false);
      return showToast("Error", "You should log in first!", "error");
    }

    try {
      const res = await axios.put(`/api/posts/like/${post._id}`);
      if (!liked) {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          }
          return p;
        });
        setPosts(updatedPosts);
      }
      setLiked(!liked);
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
    } finally {
      setIsLinking(false);
    }
  };

  const handleComment = async () => {
    setIsCommenting(true);
    if (!user) {
      setIsCommenting(false);
      onClose();
      return showToast("Error", "You should log in first!", "error");
    }
    try {
      const res = await axios.put(`/api/posts/comment/${post._id}`, {
        text: comment,
        userId: user._id,
        userProfilePic: user.profilePic,
        username: user.username,
      });
      onClose();
      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, comments: [...p.comments, res.data] };
        }
        return p;
      });
      setPosts(updatedPosts);
      showToast("Success", "Comment added successfully", "success");
      setComment("");
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
    } finally {
      setIsCommenting(false);
    }
  };
  return (
    <Flex flexDirection={"column"}>
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          xmlns="http://www.w3.org/2000/svg"
          color={liked ? "rgb(237,73,86" : "none"}
          fill={liked ? "rgb(237,73,86" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          height="20"
          width="20"
          stroke="currentColor"
          onClick={handleLike}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>

        <svg
          aria-label="Comment"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          height="20"
          width="20"
          stroke="currentColor"
          onClick={onOpen}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
          />
        </svg>

        <ShareSVG post={post} postedBy={postedBy} />
      </Flex>
      <Flex alignItems={"center"} gap={2}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.comments.length} comments
        </Text>
        <Box w={1} h={1} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post.likes.length} likes
        </Text>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder="Comment goes here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isCommenting}
              colorScheme="blue"
              mr={3}
              size={"sm"}
              onClick={handleComment}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;

const ShareSVG = ({ post, postedBy }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        const baseUrl = window.location.origin; // Get the base URL dynamically
        await navigator.share({
          title: "Share Post",
          text: post.text, // Add post title or any text you want to share
          url: `${baseUrl}/${postedBy.username}/post/${post._id}`, // Share the current page URL
        });
        console.log("Successfully shared");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.log("Web Share API not supported");
      // Fallback for browsers that do not support Web Share API
      // You can implement a custom share logic here
    }
  };

  return (
    <svg
      aria-label="Share"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      height="20"
      width="20"
      stroke="currentColor"
      onClick={handleShare}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
      />
    </svg>
  );
};
