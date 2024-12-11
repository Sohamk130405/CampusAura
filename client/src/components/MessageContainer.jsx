import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/conversationAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import useShowToast from "../hooks/useShowToast";
import messageSound from "../assets/sounds/message.mp3";
const MessageContainer = () => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef();
  const showToast = useShowToast();
  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      if (selectedConversation._id === newMessage.conversationId) {
        setMessages((prev) => [...prev, newMessage]);
      }
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversations((prev) => {
        const updatedConversation = prev.map((conversation) => {
          if (conversation._id === newMessage.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: newMessage.text,
                sender: newMessage.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
    });
    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }
    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (selectedConversation.mock) return;
        const res = await axios.get(
          `/api/messages/${selectedConversation.userId}`
        );

        setMessages(res.data);
      } catch (error) {
        console.log(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
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
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [selectedConversation, setMessages, showToast, selectedConversation.mock]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gary.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar size={"sm"} src={selectedConversation.userProfilePic} />

        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}
          {selectedConversation.isVerified && (
            <Image src="/verified.png" w={4} h={4} ml={1} />
          )}
        </Text>
      </Flex>
      <Divider />
      <Flex
        flexDirection={"column"}
        gap={4}
        my={4}
        h={"400px"}
        overflowY={"auto"}
        px={2}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}
        {!loadingMessages &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                key={message.createdAt}
                ownMessage={currentUser._id === message.sender}
                message={message}
              />
            </Flex>
          ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
