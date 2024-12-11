import {
  Avatar,
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
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Verification = () => {
  const [users, setUsers] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const handleView = (user) => {
    setViewUser(user);
    onOpen();
  };
  const handleVerify = async (userId) => {
    setActionLoading(true);
    try {
      const res = await axios.put(`/api/users/verify/${userId}`);
      setUsers((prev) => prev.filter((p) => p._id !== userId));
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setActionLoading(false);
    }
  };
  const handleReject = async (userId) => {
    try {
      const res = await axios.put(`/api/users/reject/${userId}`);
      setUsers((prev) => prev.filter((p) => p._id !== userId));
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("/api/users/getUnverifiedUsers");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [setUsers]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex w={"full"} flexDirection={"column"} gap={2}>
        {loading && <Spinner alignSelf={"center"} size={"md"} />}
        {!loading && users.length === 0 && (
          <Text>No Verifications Pending</Text>
        )}
        {!loading &&
          users.length > 0 &&
          users.map((user) => (
            <Flex
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
              p={2}
              flexWrap={"wrap"}
              justifyContent={"center"}
              borderBottom={"1px solid"}
            >
              <Avatar src={user.profilePic} />
              <Flex flexDirection={"column"} flex={1}>
                <Flex gap={2}>
                  <Text fontWeight={"bold"}>{user.name}</Text>
                  <Text fontWeight={"bold"}>{user.type}</Text>
                </Flex>
              </Flex>
              <Flex gap={2}>
                <Button colorScheme="blue" onClick={() => handleView(user)}>
                  View
                </Button>
                <Button
                  colorScheme="green"
                  onClick={() => handleVerify(user._id)}
                >
                  Verify
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleReject(user._id)}
                >
                  Reject
                </Button>
              </Flex>
            </Flex>
          ))}
      </Flex>

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
                <Text fontWeight={"semibold"}>PRN: {viewUser?.prn}</Text>
                <Text fontWeight={"semibold"}>Type: {viewUser?.type}</Text>
                <Text fontWeight={"semibold"}>Branch: {viewUser?.branch}</Text>
                <Text fontWeight={"semibold"}>Div: {viewUser?.div}</Text>
                <Text fontWeight={"semibold"}>Year: {viewUser?.year}</Text>
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

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => handleVerify(viewUser._id)}
              isLoading={actionLoading}
            >
              Verify
            </Button>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleReject(viewUser._id)}
            >
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Verification;
