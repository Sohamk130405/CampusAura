import React, { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import usePreviewFile from "../hooks/usePreviewFile";
import {
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Flex,
  CloseButton,
  useColorModeValue,
  Select,
  Menu,
  MenuItem,
  MenuButton,
  Portal,
  MenuList,
} from "@chakra-ui/react";
import { LuFiles } from "react-icons/lu";
import { BsFillImageFill, BsUpload } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";

const CreateShare = ({ divInfo, MAX_CHAR = 500, setShares, user }) => {
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { handleFileChange, fileUrl, setFileUrl, fileName } = usePreviewFile();
  const imgRef = useRef();
  const fileRef = useRef();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const bgColor = useColorModeValue("whiteAlpha.900", "gray.dark");
  const btnBgColor = useColorModeValue("blue.300", "blue.400");
  const [inputs, setInputs] = useState({
    content: "",
    img: "",
    file: "",
    fileName: "",
  });
  const [attachmentType, setAttachmentType] = useState(null); // Track the current attachment type (image or file)

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setInputs({ ...inputs, content: truncatedText });
      setRemainingChar(0);
    } else {
      setInputs({ ...inputs, content: inputText });
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleAttachmentSelect = (type) => {
    if (type === attachmentType) {
      // If the same type is selected again, remove the selection
      setAttachmentType(null);
      if (type === "image") {
        setImgUrl("");
      } else {
        setFileUrl("");
      }
    } else {
      // If a new type is selected, set the attachment type
      setAttachmentType(type);
      if (type === "image") {
        imgRef.current.click();
        setFileUrl("");
      } else {
        fileRef.current.click();
        setImgUrl("");
      }
    }
  };

  const postShare = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/shares/", {
        content: inputs.content,
        img: imgUrl || null,
        file: fileUrl || null,
        div: divInfo?.div,
        year: divInfo?.year,
        branch: divInfo?.branch,
        fileName: fileName || null,
      });
      if (res.data.success) {
        setShares((prev) => [
          ...prev,
          {
            content: inputs.content,
            img: imgUrl || null,
            file: fileName || null,
            div: divInfo?.div,
            year: divInfo?.year,
            branch: divInfo?.branch,
            createdAt: Date.now(),
            sender: {
              _id: user._id,
              username: user.username,
              name: user.name,
              profilePic: user.profilePic,
            },
          },
        ]);
        onClose();
        showToast(
          "Success",
          "Share posted successfully! Refresh the feed",
          "success"
        );
        setInputs({
          content: "",
          img: "",
          file: "",
          fileName: "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {divInfo.div !== "" && divInfo.year !== "" && divInfo.branch !== "" && (
        <Button
          bg={btnBgColor}
          position={"fixed"}
          right={10}
          bottom={10}
          onClick={onOpen}
        >
          Share
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>Share</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={1}>
              <FormLabel>Share Content</FormLabel>
              <Textarea
                type="text"
                name="content"
                value={inputs.content}
                placeholder="Elaborate the share here..."
                onChange={handleTextChange}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
                color={useColorModeValue("gray.dark", "gray.100")}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
            </FormControl>

            <FormControl>
              <Input
                type="file"
                hidden
                ref={imgRef}
                onChange={handleImageChange}
              />
              <Input
                type="file"
                hidden
                ref={fileRef}
                onChange={handleFileChange}
              />

              <Select
                placeholder="Select Attachment"
                onChange={(e) => handleAttachmentSelect(e.target.value)}
                value={attachmentType || ""}
              >
                <option value="image">Image</option>
                <option value="file">File</option>
              </Select>

              {fileUrl && (
                <Flex
                  position={"relative"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  p={5}
                  border={"1px solid"}
                  rounded={"md"}
                  w={"full"}
                  m={1}
                  bg={bgColor}
                >
                  <CloseButton
                    onClick={() => setFileUrl("")}
                    bg={"gray.800"}
                    position={"absolute"}
                    top={2}
                    right={2}
                    color={"white"}
                  />
                  <a href={fileUrl}>
                    <LuFiles size={40} />
                  </a>
                  <Text fontWeight={"semibold"}>{fileName}</Text>
                </Flex>
              )}
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
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="yellow"
              mr={3}
              onClick={postShare}
              isLoading={loading}
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateShare;
