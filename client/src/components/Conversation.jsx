import {
  Avatar,
  AvatarBadge,
  Flex,
  WrapItem,
  useColorModeValue,
  Stack,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/conversationAtom";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];

  const lastMessage = conversation.lastMessage;
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  return (
    <Flex
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          username: user?.username,
          userId: user?._id,
          userProfilePic: user?.profilePic,
          isVerified: user?.isVerified,
          mock: conversation.mock,
        })
      }
      bg={selectedConversation?._id === conversation._id ? "gray.400" : ""}
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user?.profilePic}
        >
          <AvatarBadge
            boxSize={"1em"}
            bg={isOnline ? "green.500" : "gray.500"}
          />
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user?.username}
          {user?.isVerified && <Image src="/verified.png" w={4} h={4} ml={1} />}
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser._id === conversation.lastMessage.sender ? (
            <Box color={lastMessage.seen ? "green.300" : ""}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ""
          )}
          {lastMessage.text.length > 18
            ? lastMessage.text.substring(0, 18) + "..."
            : lastMessage.text || <BsFillImageFill />}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
