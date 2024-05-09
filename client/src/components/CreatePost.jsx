import React, { useRef, useState } from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Textarea,
  Text,
  Input,
  Flex,
  Image,
  CloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";
import { AddIcon } from "@chakra-ui/icons";
import usePreviewImg from "../hooks/usePreviewImg";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postAtom from "../atoms/postAtom";
import { useParams } from "react-router-dom";
const CreatePost = ({ MAX_CHAR = 500 }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postAtom);
  const { username } = useParams();
  const bgColor = useColorModeValue("whiteAlpha.900", "gray.dark");
  const btnBgColor = useColorModeValue("gray.200", "gray.700");
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slic(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };
  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/posts/create", {
        postedBy: user._id,
        text: postText,
        img: imgUrl,
      });
      showToast("Success", "Post created successfully!", "success");
      if (username === user.username) {
        setPosts([res.data, ...posts]);
      }
      onClose();
      setPostText("");
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
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        size={{ base: "sm", md: "md" }}
        onClick={onOpen}
        bg={btnBgColor}
      >
        <AddIcon />
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here..."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type="file"
                hidden
                ref={fileRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                onClick={() => fileRef.current.click()}
                style={{ marginLeft: "5px", cursor: "pointer" }}
              />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected Image" />
                <CloseButton
                  onClick={() => setImgUrl("")}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                  color={"white"}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
