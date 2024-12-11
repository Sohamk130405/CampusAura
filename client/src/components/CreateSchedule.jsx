import React, { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
const CreateSchedule = ({ title, deadLineOrSchedule, type }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();
  const bgColor = useColorModeValue("whiteAlpha.900", "gray.dark");
  const btnBgColor = useColorModeValue("gray.200", "gray.700");
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputs, setInputs] = useState({
    link: "",
    subject: "",
    div: "",
    branch: "",
    year: "",
  });

  const handleSchedule = async () => {
    const res = await axios.post("/api/schedules", {
      link: inputs.link,
      subject: inputs.subject,
      div: inputs.div,
      branch: inputs.branch,
      year: inputs.year,
      type: type,
      time: selectedDate,
    });
    if (res.data.success) {
      showToast("success", `${type} sheduled successfully`, "success");
      onClose();
    }
  };
  return (
    <>
      <Button bg={btnBgColor} position={"fixed"} right={10} bottom={10} onClick={onOpen}>
        Schedule {type}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Link</FormLabel>
              <Input
                type="text"
                placeholder="url goes here..."
                onChange={(e) => setInputs({ ...inputs, link: e.target.value })}
              />
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
                <option value="Universal Human Values">Robotics</option>
                <option value="Universal Human Values">
                  Universal Human Value
                </option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{deadLineOrSchedule} time</FormLabel>
              <Box border={"1px solid"} rounded={"md"} p={2}>
                <DatePicker
                  selected={selectedDate || new Date()}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm:ss"
                />
              </Box>
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
                <option value="All">All</option>
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
                <option value="All">All</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={handleSchedule}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateSchedule;
