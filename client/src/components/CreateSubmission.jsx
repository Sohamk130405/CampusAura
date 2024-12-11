import React, { useRef, useState } from "react";
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
  Select,
  Flex,
  CloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { LuFiles } from "react-icons/lu";
import { BsFillImageFill, BsUpload } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { BiUserPlus } from "react-icons/bi";
const CreateSubmission = ({ assignId, isSubmitted }) => {
  const [inputs, setInputs] = useState({
    text: "",
    img: "",
    file: "",
    fileName: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleFileChange, fileUrl, setFileUrl, fileName } = usePreviewFile();
  const imgRef = useRef();
  const fileRef = useRef();
  const bgColor = useColorModeValue("whiteAlpha.900", "gray.dark");
  const btnBgColor = useColorModeValue("gray.200", "gray.700");
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  const sendSubmission = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/assignments/submissions/${assignId}`, {
        file: fileUrl || null,
        fileName: fileName || null,
      });
      if (res.data.success) {
        onClose();
        showToast(
          "Success",
          "Submission made successfully! Refresh the feed",
          "success"
        );
        setInputs({
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
      <Button
        flex="1"
        variant="ghost"
        colorScheme="green"
        leftIcon={<BiUserPlus />}
        onClick={onOpen}
      >
        {isSubmitted ? "Resubmit" : "Submit"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>Send Submission</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                type="file"
                hidden
                ref={fileRef}
                onChange={handleFileChange}
              />
              <Flex justifyContent={"center"} alignItems={"center"}>
                <BsUpload
                  size={100}
                  onClick={() => fileRef.current.click()}
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                />
              </Flex>
              {fileUrl && (
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  p={5}
                  border={"1px solid"}
                  rounded={"md"}
                  w={"full"}
                  m={1}
                  bg={"gray.200"}
                >
                  <a href={fileUrl}>
                    <LuFiles size={40} />
                  </a>
                  <Text fontWeight={"semibold"}>{fileName}</Text>
                </Flex>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="yellow"
              mr={3}
              onClick={sendSubmission}
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

export default CreateSubmission;
