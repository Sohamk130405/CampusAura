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
const CreateNotice = ({ MAX_CHAR = 500 }) => {
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
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    img: "",
    file: "",
    div: "",
    year: "",
    branch: "",
    fileName: "",
  });

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
  const sendNotice = async () => {
    setLoading(true);
    try {
      console.log("btn");
      const res = await axios.post("/api/notices/", {
        title: inputs.title,
        content: inputs.content,
        img: imgUrl || null,
        file: fileUrl || null,
        div: inputs.div,
        year: inputs.year,
        branch: inputs.branch,
        fileName: fileName || null,
      });
      if (res.data.success) {
        onClose();
        showToast(
          "Success",
          "Notice sent successfully! Refresh the feed",
          "success"
        );
        setInputs({
          title: "",
          content: "",
          img: "",
          file: "",
          div: "",
          year: "",
          branch: "",
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
      <Button bg={btnBgColor} position={"fixed"} right={10} bottom={10} onClick={onOpen}>
        Send Notice
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>Send Notice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={1}>
              <FormLabel>Notice Title</FormLabel>
              <Input
                type="text"
                name="title"
                placeholder={"Notice Regarding..."}
                onChange={(e) =>
                  setInputs({ ...inputs, title: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb={1}>
              <FormLabel>Notice Content</FormLabel>
              <Textarea
                type="text"
                name="content"
                value={inputs.content}
                placeholder="Elaborate the notice here..."
                onChange={handleTextChange}
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
            </FormControl>
            <FormControl mb={1}>
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
                <option value="All">All</option>
              </Select>
            </FormControl>
            <FormControl mb={1}>
              <FormLabel>Branch</FormLabel>
              <Select
                name="branch"
                placeholder="Select Branch"
                onChange={(e) =>
                  setInputs({ ...inputs, branch: e.target.value })
                }
              >
                <option value="All">All</option>
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
            <FormControl mb={1}>
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
                <option value="All">All</option>
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
                  bg={bgColor}
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
              onClick={sendNotice}
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

export default CreateNotice;
