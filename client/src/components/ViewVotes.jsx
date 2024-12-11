import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Button,
  Text,
} from "@chakra-ui/react";
import { BiPoll } from "react-icons/bi";
const ViewVotes = ({ votes, total }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const result = (votes / total) * 100;
  console.log(result);
  return (
    <>
      <Button
        flex="1"
        variant="ghost"
        colorScheme="blue"
        leftIcon={<BiPoll />}
        onClick={onOpen}
      >
        View Votes
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Extend Deadline Votes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight={"semibold"} mb={2}>
              {result.toPrecision(3)}% of the students wants to extend deadline
            </Text>
            <Progress colorScheme="green" value={result} rounded={"md"} />
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewVotes;
