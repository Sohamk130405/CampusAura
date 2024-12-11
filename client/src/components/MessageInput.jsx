import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import React, { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/conversationAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { BsFillImageFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import usePreviewImg from "../hooks/usePreviewImg";
const MessageInput = ({ setMessages }) => {
  const [messageText, setMessagesText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const showToast = useShowToast();
  const imageRef = useRef(null);

  const [isSending, setIsSending] = useState(false);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    if (!messageText && !imgUrl) return;
    try {
      const res = await axios.post("/api/messages/", {
        recipientId: selectedConversation.userId,
        message: messageText,
        img: imgUrl,
      });
      setMessages((prev) => [...prev, res.data]);
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: res.data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessagesText("");
      setImgUrl("");
    } catch (error) {
      console.log(error);
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
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            placeholder="type message..."
            w={"full"}
            value={messageText}
            onChange={(e) => setMessagesText(e.target.value)}
          />
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <IoMdSend />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>
      <Modal
        isOpen={imgUrl}
        onClose={() => {
          onClose();
          setImgUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imgUrl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IoSendSharp
                  size={24}
                  cursor={"pointer"}
                  onClick={handleSendMessage}
                />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
