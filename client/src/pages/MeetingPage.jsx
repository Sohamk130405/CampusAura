import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import ContentCard from "../components/ContentCard";
import SchedulesContainer from "../components/SchedulesContainer";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
const MeetingPage = () => {
  const user = useRecoilValue(userAtom);
  return (
    <>
      <Flex flexDir={"column"} gap={4}>
        {user.type === "faculty" && (
          <Flex
            gap={2}
            w={"full"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <ContentCard
              heading={"Zoom Meeting"}
              img={"/zoom.png"}
              link={"https://us05web.zoom.us/meeting/schedule"}
              btnText={"Zoom"}
              color={"blue"}
            />
            <ContentCard
              heading={"Google Meet"}
              img={"/meet.png"}
              link={"https://meet.google.com/"}
              btnText={"Meet"}
              color={"green"}
            />
          </Flex>
        )}
        <Text mt={4} textAlign={"center"} fontWeight={"bold"} fontSize={"xl"}>
          Scheduled Meets
        </Text>
        <SchedulesContainer type={"meet"} />
      </Flex>
    </>
  );
};

export default MeetingPage;
