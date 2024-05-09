import { Button, Flex, Text, Box, useColorMode, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const SettingsPage = () => {
  const showToast = useShowToast();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const { toggleColorMode } = useColorMode();
  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account?"))
      return;

    try {
      const res = await axios.put("/api/users/freeze");
      if (res.data.success) {
        await logout();
        showToast("Success", "Your Account has been frozen", "success");
      }
    } catch (error) {
      console.log(error);
      // If the error is from the server (e.g., network error, 500 Internal Server Error)
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        showToast("Error", errorMessage, "error");
      } else {
        // If the error object does not contain the expected structure
        showToast(
          "Error",
          "An error occurred. Please try again later.",
          "error"
        );
      }
    }
  };
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      const res = await axios.delete("/api/users/delete");
      if (res.data.success) {
        localStorage.removeItem("user-campusaura");
        setUser(null);
        navigate("/auth");
        showToast("Success", "Your Account has been deleted", "success");
      }
    } catch (error) {
      console.log(error);
      // If the error is from the server (e.g., network error, 500 Internal Server Error)
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        showToast("Error", errorMessage, "error");
      } else {
        // If the error object does not contain the expected structure
        showToast(
          "Error",
          "An error occurred. Please try again later.",
          "error"
        );
      }
    }
  };
  return (
    <>
      <Flex flexDir={"column"} gap={2}>
        <Box borderBottom={"1px solid"} py={2}>
          <Text my={1} fontWeight={"bold"}>
            Theme
          </Text>
          <Text my={1}>Toggle Dark Mode Or Light Mode</Text>
          <Button
            size={"sm"}
            bg={useColorModeValue("gray.200", "gray.dark")}
            onClick={toggleColorMode}
          >
            Change
          </Button>
        </Box>
        <Box borderBottom={"1px solid"} py={2}>
          <Text my={1} fontWeight={"bold"}>
            Logout from this device
          </Text>
          <Text my={1}>You can login anytime.</Text>
          <Button
            size={"sm"}
            bg={useColorModeValue("gray.200", "gray.dark")}
            onClick={logout}
          >
            Logout
          </Button>
        </Box>

        <Box borderBottom={"1px solid"} py={2}>
          <Text my={1} fontWeight={"bold"}>
            Freeze Your Account
          </Text>
          <Text my={1}>
            You can unfreeze your account anytime by logging in.
          </Text>
          <Button size={"sm"} colorScheme="yellow" onClick={freezeAccount}>
            Freeze
          </Button>
        </Box>
        <Box borderBottom={"1px solid"} py={2}>
          <Text my={1} fontWeight={"bold"}>
            Delete Your Account
          </Text>
          <Text my={1}>You can't recover your account once deleted.</Text>
          <Button size={"sm"} colorScheme="red" onClick={deleteAccount}>
            Delete
          </Button>
        </Box>
      </Flex>
    </>
  );
};

export default SettingsPage;
