import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import {
  BsCheck,
  BsDashCircle,
  BsFillFileCheckFill,
  BsFillImageFill,
  BsHandThumbsUp,
  BsPersonFill,
  BsTrashFill,
} from "react-icons/bs";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import { BiCross } from "react-icons/bi";
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const deleteNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.delete("/api/notifications/");
      if (res.data.success) {
        showToast("Success", "All notifications deleted successfully!");
        setNotifications([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications/");
        console.log(res.data);
        setNotifications(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getNotifications();
  }, [setNotifications]);
  return (
    <>
      <Flex flexDir={"column"} gap={2} alignItems={"center"}>
        <Flex alignItems={"center"} justifyContent={"space-around"} w={"full"}>
          <Text fontWeight={"bold"} fontSize={20}>
            Notifications
          </Text>
          {notifications.length > 0 && (
            <BsTrashFill
              size={20}
              cursor={"pointer"}
              onClick={deleteNotifications}
            />
          )}
        </Flex>
        {!loading && notifications.length === 0 && (
          <Text>No notifications</Text>
        )}
        {!loading &&
          notifications.length > 0 &&
          notifications.map(
            (noti) =>
              noti.from &&
              noti.to && (
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  w={"full"}
                  gap={2}
                  key={noti._id}
                  flexWrap={"wrap"}
                  p={1}
                  borderRadius={"md"}
                  cursor={"pointer"}
                  onClick={() => navigate(`/${noti.from.username}`)}
                >
                  <Flex alignItems={"center"} gap={2}>
                    <Avatar src={noti.from.profilePic} size={"sm"} />
                    <Text fontWeight={"bold"} fontSize={18}>
                      {noti.from.username}
                    </Text>
                  </Flex>
                  <Flex gap={2} alignItems={"center"}>
                    {noti.type === "follow" && (
                      <>
                        <Text fontWeight={"semibold"}>
                          started following you
                        </Text>
                        <BsPersonFill size={20} color="blue" />
                      </>
                    )}
                    {noti.type === "like" && (
                      <>
                        <Text fontWeight={"semibold"}>liked your post</Text>
                        <BsHandThumbsUp size={20} color="red" />
                      </>
                    )}
                    {noti.type === "assignment" && (
                      <>
                        <Text fontWeight={"semibold"}>sent assignment</Text>
                        <BsFillFileCheckFill size={20} color="green" />
                      </>
                    )}
                    {noti.type === "new-post" && (
                      <>
                        <Text fontWeight={"semibold"}>added new post</Text>
                        <BsFillImageFill size={20} color="green" />
                      </>
                    )}
                    {noti.type === "verify" && (
                      <>
                        <Text fontWeight={"semibold"}>
                          verified your profile
                        </Text>
                        <BsCheck size={20} color="blue" />
                      </>
                    )}
                    {noti.type === "reject" && (
                      <>
                        <Text fontWeight={"semibold"}>
                          rejected your profile, so update it
                        </Text>
                        <BsDashCircle size={20} color="red" />
                      </>
                    )}
                  </Flex>
                </Flex>
              )
          )}
        {loading &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
            >
              <SkeletonCircle size={10} />
              <Flex flexDirection={"column"} gap={2}>
                <Skeleton h={"20px"} w={"300px"} />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default NotificationsPage;
