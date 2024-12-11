import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import ContentCard from "../components/ContentCard";
import SchedulesContainer from "../components/SchedulesContainer";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const QuizPage = () => {
  const user = useRecoilValue(userAtom);
  return (
    <>
      <Flex flexDir={"column"} gap={4}>
        {user.type === "faculty" && (
          <Flex
            gap={2}
            w={"full"}
            flexWrap={"wrap"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <ContentCard
              heading={"Google Form"}
              img={"/google-forms.png"}
              link={
                "https://docs.google.com/forms/u/0/?tgif=d&ec=asw-forms-hero-goto"
              }
              btnText={"Google"}
              color={"purple"}
            />
            <ContentCard
              heading={"Microsoft Forms"}
              img={"/form.png"}
              link={
                "https://forms.office.com/Pages/DesignPageV2.aspx?subpage=creationv2"
              }
              btnText={"Microsoft"}
              color={"teal"}
            />
            <ContentCard
              heading={"Menti Meter"}
              img={"/letter-m.png"}
              link={"https://www.mentimeter.com/features/quiz-presentations"}
              btnText={"Menti"}
              color={"blue"}
            />
          </Flex>
        )}
        <Text mt={4} textAlign={"center"} fontWeight={"bold"} fontSize={"xl"}>
          Scheduled Meets
        </Text>
        <SchedulesContainer type={"quiz"} />
      </Flex>
    </>
  );
};

export default QuizPage;
