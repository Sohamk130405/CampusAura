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
  useColorModeValue,
} from "@chakra-ui/react";
import { LuFiles } from "react-icons/lu";
import { BsFillImageFill, BsUpload } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
const CreateAssignment = ({ MAX_CHAR = 500 }) => {
  const [inputs, setInputs] = useState({
    text: "",
    subject: "",
    img: "",
    file: "",
    div: "",
    year: "",
    branch: "",
    fileName: "",
    deadline: "",
  });
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { handleFileChange, fileUrl, setFileUrl, fileName } = usePreviewFile();
  const imgRef = useRef();
  const fileRef = useRef();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const bgColor = useColorModeValue("whiteAlpha.900", "gray.dark");
  const btnBgColor = useColorModeValue("gray.200", "gray.700");
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

  const sendAssignment = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/assignments/", {
        text: inputs.text,
        subject: inputs.subject,
        img: imgUrl || null,
        file: fileUrl || null,
        div: inputs.div,
        year: inputs.year,
        branch: inputs.branch,
        fileName: fileName || null,
        deadline: inputs.deadline,
      });
      if (res.data.success) {
        onClose();

        showToast(
          "Success",
          "Assignment sent successfully! Refresh the feed",
          "success"
        );
        setInputs({
          text: "",
          subject: "",
          img: "",
          file: "",
          div: "",
          year: "",
          branch: "",
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
      <Button
        bg={btnBgColor}
        position={"fixed"}
        right={10}
        bottom={10}
        onClick={onOpen}
      >
        Send Assignment
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>Send Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired mb={1}>
              <FormLabel>Assignment Text</FormLabel>
              <Textarea
                type="text"
                name="content"
                placeholder="Instructions..."
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
                <option value="Robotics">Robotics</option>
                <option value="Universal Human Values">
                  Universal Human Value
                </option>
              </Select>
            </FormControl>
            <FormControl isRequired mb={1}>
              <FormLabel>Deadline</FormLabel>
              <Input
                type="date"
                onChange={(e) =>
                  setInputs({ ...inputs, deadline: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={1} isRequired>
              <FormLabel>Year</FormLabel>
              <Select
                name="year"
                placeholder="Select Year"
                onChange={(e) => setInputs({ ...inputs, year: e.target.value })}
              >
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Third">Third</option>
                <option value="Fourth">Fourth</option>
              </Select>
            </FormControl>
            <FormControl mb={1} isRequired>
              <FormLabel>Branch</FormLabel>
              <Select
                name="branch"
                placeholder="Select Branch"
                onChange={(e) =>
                  setInputs({ ...inputs, branch: e.target.value })
                }
              >
                <option value="Computer Engineering">
                  Computer Engineering
                </option>
                <option value="Computer Science AI">Computer Science AI</option>
                <option value="Computer Science AIML">
                  Computer Science AIML
                </option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="AI and DS">AI and DS</option>
                <option value="Electronics And Telecommunication">
                  Electronics and Telecommunication
                </option>
                <option value="Mechnical Engineering">
                  Mechnical Engineering
                </option>
                <option value="Instrumentation">Instrumentation</option>
                <option value="Chemical Engineering">
                  Chemical Engineering
                </option>
              </Select>
            </FormControl>
            <FormControl mb={1} isRequired>
              <FormLabel>Division</FormLabel>
              <Select
                name="div"
                placeholder="Select Division"
                onChange={(e) => setInputs({ ...inputs, div: e.target.value })}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </Select>
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
              {imgUrl && (
                <Flex mt={5} w={"full"} position={"relative"}>
                  <Image src={imgUrl} alt="Selected Image" />
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
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="yellow"
              mr={3}
              onClick={sendAssignment}
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

export default CreateAssignment;
