import { Text, Flex, SkeletonCircle, Skeleton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";

const SuggestedUsers = ({ navigate, setUser }) => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([
    {
      username: "elonmusk",
      name: "Elon Musk",
      profilePic: "",
      _id: Date.now(),
    },
  ]);

  const showToast = useShowToast();
  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        const res = await axios.get("/api/users/suggested");
        setSuggestedUsers(res.data);
      } catch (error) {
        showToast("Logout", "Session expired login again", "error");
      } finally {
        setLoading(false);
      }
    };
    getSuggestedUsers();
  }, [setSuggestedUsers, showToast]);
  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Suggested Users
      </Text>
      <Flex flexDirection={"column"} gap={4}>
        {!loading &&
          suggestedUsers.length > 0 &&
          suggestedUsers.map((suggestedUser) => (
            <SuggestedUser user={suggestedUser} key={suggestedUser._id} />
          ))}
        {loading &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={"flex-start"}
            >
              <SkeletonCircle size={10} />
              <Flex flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"90px"} />
              </Flex>
              <Flex>
                <Skeleton h={"20px"} w={"60px"} />
              </Flex>
            </Flex>
          ))}
        {!loading && !suggestedUsers.length > 0 && <Text>No Suggestions!</Text>}
      </Flex>
    </>
  );
};

export default SuggestedUsers;
