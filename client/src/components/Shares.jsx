import React from "react";
import {
  Button,
  Heading,
  Text,
  Image,
  Box,
  useColorModeValue,
  Flex,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { LuFiles } from "react-icons/lu";
import axios from "axios";
import { BsTrashFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
const Shares = ({ share, user, setShares, setLoading }) => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const deleteShare = async (req, res) => {
    setLoading(true);
    try {
      const res = await axios.delete("/api/shares/" + share._id);
      if (res.data.success) {
        setShares((prev) => prev.filter((p) => p._id !== share._id));
        showToast("Success", "Notice deleted successfully!", "success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {share.sender._id === user._id ? (
        <Flex
          gap={2}
          alignItems={"center"}
          p={1}
          borderRadius={"md"}
          alignSelf={"flex-end"}
        >
          <Box
            cursor={"pointer"}
            position={"relative"}
            top={2}
            onClick={deleteShare}
          >
            {<BsTrashFill size={15} />}
          </Box>
          <Flex
            flexDir={"column"}
            mt={5}
            maxW={"350px"}
            bg={"blue.500"}
            p={1}
            borderRadius={"md"}
          >
            {share.content && (
              <Text color={"white"} p={1}>
                {share.content}
              </Text>
            )}

            {share.img && (
              <Image w={"200px"} src={share.img} borderRadius={4} />
            )}
            {share.file && (
              <Flex
                gap={2}
                p={1}
                border={"1px solid"}
                rounded={"md"}
                color={useColorModeValue("gray.100", "white")}
                bg={useColorModeValue("gray.600", "gray.900")}
              >
                <LuFiles size={20} />
                <a href={axios.defaults.baseURL + "/uploads/" + share.file}>
                  {share.file}
                </a>
              </Flex>
            )}
          </Flex>

          <Avatar w={7} h={7} src={user.profilePic} />
        </Flex>
      ) : (
        <Flex
          gap={2}
          alignItems={"center"}
          p={1}
          borderRadius={"md"}
          alignSelf={"flex-start"}
        >
          <Avatar
            onClick={() => navigate(`/${share.sender.username}`)}
            w={7}
            h={7}
            src={share.sender.profilePic}
          />

          <Flex
            flexDir={"column"}
            mt={5}
            maxW={"350px"}
            bg={"gray.400"}
            p={1}
            borderRadius={"md"}
          >
            {share.content && (
              <Text color={"black"} p={1}>
                {share.content}
              </Text>
            )}

            {share.img && (
              <Image w={"200px"} src={share.img} borderRadius={4} />
            )}

            {share.file && (
              <Flex
                gap={2}
                p={1}
                border={"1px solid"}
                rounded={"md"}
                color={useColorModeValue("gray.100", "white")}
                bg={useColorModeValue("gray.600", "gray.900")}
              >
                <LuFiles size={20} />
                <a href={axios.defaults.baseURL + "/uploads/" + share.file}>
                  {share.file}
                </a>
              </Flex>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Shares;
