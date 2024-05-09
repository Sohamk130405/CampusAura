import { Avatar, Box, Flex, Text, Image, Skeleton } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/conversationAtom";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  return (
    <>
      {ownMessage ? (
        <Flex
          gap={2}
          alignItems={"center"}
          p={1}
          borderRadius={"md"}
          alignSelf={"flex-end"}
        >
          {message.text && (
            <Flex maxW={"350px"} bg={"blue.500"} p={1} borderRadius={"md"}>
              <Text color={"white"}>{message.text}</Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "green.300" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}
          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} borderRadius={4} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "green.300" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          <Avatar w={7} h={7} src={currentUser.profilePic} />
        </Flex>
      ) : (
        <Flex
          gap={2}
          alignItems={"center"}
          p={1}
          borderRadius={"md"}
          alignSelf={"flex-start"}
        >
          <Avatar w={7} h={7} src={selectedConversation.userProfilePic} />
          {message.text && (
            <Text
              maxW={"350px"}
              bg={"gray.400"}
              p={1}
              borderRadius={"md"}
              color={"black"}
            >
              {message.text}
            </Text>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}
          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;
