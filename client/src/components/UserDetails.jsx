import {
  Button,
  Flex,
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
  Box,
} from "@chakra-ui/react";
import React from "react";

const UserDetails = ({ viewUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text onClick={onOpen}>Check Details</Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" alignItems="start">
              <Box mb={2}>
                <Text fontWeight={"semibold"}>Name: {viewUser?.name}</Text>
                <Text fontWeight={"semibold"}>Phone: {viewUser?.phone}</Text>
                {viewUser.type === "student" && (
                  <>
                    <Text fontWeight={"semibold"}>PRN: {viewUser?.prn}</Text>
                    <Text fontWeight={"semibold"}>Type: {viewUser?.type}</Text>
                    <Text fontWeight={"semibold"}>
                      Branch: {viewUser?.branch}
                    </Text>
                    <Text fontWeight={"semibold"}>Div: {viewUser?.div}</Text>
                    <Text fontWeight={"semibold"}>Year: {viewUser?.year}</Text>
                  </>
                )}
                <Text fontWeight={"semibold"}>Email: {viewUser?.email}</Text>
              </Box>
              <Text fontWeight={"semibold"}>Profile Pic:</Text>
              {viewUser?.profilePic ? (
                <Image
                  boxSize={"xs"}
                  alignSelf={"center"}
                  rounded={"md"}
                  src={viewUser?.profilePic}
                />
              ) : (
                <Text>No Profile Photo</Text>
              )}
            </Flex>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserDetails;
