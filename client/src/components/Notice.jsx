import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Button,
  Heading,
  Text,
  Image,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { LuFiles } from "react-icons/lu";
import axios from "axios";
import { BsTrashFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
const Notice = ({ notice, user, setNotices, setLoading }) => {
  const showToast = useShowToast();
  const bgColor = useColorModeValue("whiteAlpha.900", "gray.dark");
  const btnBgColor = useColorModeValue("gray.200", "gray.700");
  const deleteNotice = async (req, res) => {
    setLoading(true);
    try {
      const res = await axios.delete("/api/notices/" + notice._id);
      if (res.data.success) {
        setNotices((prev) => prev.filter((p) => p._id !== notice._id));
        showToast("Success", "Notice deleted successfully!", "success");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card bg={bgColor}>
      <CardHeader>
        <Heading size="md">{notice.title}</Heading>
        <Text>
          {new Date(notice.createdAt).toLocaleDateString("en-IN", {
            weekday: "long", // Display full weekday name
            day: "numeric", // Display day of the month
            month: "long", // Display full month name
            year: "numeric", // Display full year
          })}
        </Text>
        <Box
          position={"absolute"}
          cursor={"pointer"}
          top={7}
          right={10}
          onClick={deleteNotice}
        >
          {user._id === notice.sender && <BsTrashFill size={20} />}
        </Box>
      </CardHeader>
      <CardBody>
        {notice.img && <Image src={notice.img} rounded={"md"} mb={1} />}
        <Text>{notice.content}</Text>
      </CardBody>
      {notice.file && (
        <CardFooter alignSelf={"center"}>
          <Button display={"flex"} gap={2} bg={btnBgColor}>
            <LuFiles size={20} />
            <a href={axios.defaults.baseURL + "/uploads/" + notice.file}>
              Download Attachments
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Notice;
