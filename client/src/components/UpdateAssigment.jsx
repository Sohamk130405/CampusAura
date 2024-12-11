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
  Select,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { LuFiles } from "react-icons/lu";
import { BsFillImageFill, BsUpload } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
const UpdateAssignment = ({ assignment, MAX_CHAR = 500 }) => {
  const [inputs, setInputs] = useState({
    text: assignment.text,
    subject: assignment.subject,
    img: assignment.img,
    file: assignment.file,
    fileName: assignment.fileName,
    deadline: assignment.deadline,
  });
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { handleFileChange, fileUrl, setFileUrl, fileName } = usePreviewFile();
  const imgRef = useRef();
  const fileRef = useRef();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setInputs({ ...inputs, text: truncatedText });
      setRemainingChar(0);
    } else {
      setInputs({ ...inputs, text: inputText });
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const updateAssignment = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/assignments/${assignment._id}`, {
        text: inputs.text,
        subject: inputs.subject,
        img: imgUrl || null,
        file: fileUrl || null,
        fileName: fileName || null,
        deadline: inputs.deadline,
      });
      if (res.data.success) {
        onClose();
        showToast(
          "Success",
          "Assignment Updated successfully! Refresh the feed",
          "success"
        );
        setInputs({
          text: "",
          subject: "",
          img: "",
          file: "",
          fileName: "",
          deadline: "",
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
      <Text _hover={true} onClick={onOpen}>
        Edit Assignment
      </Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={1}>
              <FormLabel>Assignment Text</FormLabel>
              <Textarea
                type="text"
                name="content"
                placeholder="Instructions..."
                value={inputs.text}
                onChange={handleTextChange}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
            </FormControl>
            <FormControl mb={1} isRequired>
              <FormLabel>Subject</FormLabel>
              <Select
                name="subject"
                placeholder="Select Subject"
                value={inputs.subject}
                onChange={(e) =>
                  setInputs({ ...inputs, subject: e.target.value })
                }
              >
                <option value="Mobile Application Development">
                  Mobile Application Development
                </option>
                <option value="Principles of programming language">
                  Principles of programming language
                </option>
                <option value="Data Science">Data Science</option>
                <option value="Universal Human Values">Robotics</option>
                <option value="Universal Human Values">
                  Universal Human Value
                </option>
              </Select>
            </FormControl>
            <FormControl isRequired mb={1}>
              <FormLabel>Deadline</FormLabel>
              <Input
                type="date"
                value={inputs.deadline}
                onChange={(e) =>
                  setInputs({ ...inputs, deadline: e.target.value })
                }
              />
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
              <Flex>
                <BsFillImageFill
                  size={20}
                  onClick={() => imgRef.current.click()}
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                />
                <BsUpload
                  size={20}
                  onClick={() => fileRef.current.click()}
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                />
              </Flex>
              {fileUrl ||
                (assignment.file && (
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
                    <a
                      href={
                        fileUrl ||
                        axios.defaults.baseURL + "/uploads/" + assignment.file
                      }
                    >
                      <LuFiles size={40} />
                    </a>
                    <Text fontWeight={"semibold"}>
                      {fileName || assignment.file}
                    </Text>
                  </Flex>
                ))}
              {imgUrl ||
                (assignment.img && (
                  <Flex mt={5} w={"full"} position={"relative"}>
                    <Image
                      src={imgUrl || assignment.img}
                      alt="Selected Image"
                    />
                    <CloseButton
                      onClick={() => {
                        setImgUrl("");
                      }}
                      bg={"gray.800"}
                      position={"absolute"}
                      top={2}
                      right={2}
                      color={"white"}
                    />
                  </Flex>
                ))}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="yellow"
              mr={3}
              onClick={updateAssignment}
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

export default UpdateAssignment;
