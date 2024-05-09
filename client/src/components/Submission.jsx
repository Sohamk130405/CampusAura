import {
  Avatar,
  Input,
  Td,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { BiFile } from "react-icons/bi";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";

const Submission = ({ submission }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [marks, setMarks] = useState(submission.marks);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const handleMarksUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = axios.put(`/api/assignments/submissions/${submission._id}`, {
        marks,
      });
      if ((await res).data.success) {
        showToast(
          "success",
          "Marks Updated Successfully,refresh the page",
          "success"
        );
        onClose();
      }
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        "An unexpected error occur, try again after sometimes!",
        "error"
      );
    }
  };
  return (
    <>
      <Tr>
        <Td
          display={"flex"}
          alignItems={"center"}
          gap={1}
          cursor={"pointer"}
          onClick={() => navigate(`/${submission.student.username}`)}
        >
          <Avatar

            name={submission.student.name}
            src={submission.student.profilePic}
            size={"sm"}
          />
          {submission.student.name}
        </Td>
        <Td>{submission.student.prn}</Td>
        <Td>
          <a href={axios.defaults.baseURL + "/uploads/" + submission.file}>
            <BiFile size={30} />
          </a>
        </Td>
        <Td isNumeric onClick={onOpen}>
          {submission.marks}
        </Td>
      </Tr>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Marks</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight={"bold"}>Name : {submission.student.name}</Text>
            <Text fontWeight={"bold"}>Current Marks : {submission.marks}</Text>
            <Input
              mt={2}
              type="number"
              placeholder="new marks..."
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={handleMarksUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Submission;
