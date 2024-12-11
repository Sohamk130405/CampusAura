import { Avatar, Td, Tr, Button, Text, Flex } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
const Schedule = ({ schedule }) => {
  const navigate = useNavigate();
  return (
    <Tr>
      <Td cursor={"pointer"}>
        <Flex
          gap={1}
          alignItems={"center"}
          onClick={() => navigate(`/${schedule.faculty.username}`)}
        >
          <Avatar
            name={schedule.faculty.name}
            src={schedule.faculty.profilePic}
            size={"sm"}
          />
          <Text>{schedule.faculty.name}</Text>
        </Flex>
      </Td>
      <Td>{schedule.subject}</Td>
      <Td isNumeric>
        {new Date(schedule.time).toLocaleDateString("en-IN", {
          weekday: "long", // Display full weekday name
          day: "numeric", // Display day of the month
          month: "long", // Display full month name
          hour: "2-digit",
        })}
      </Td>
      <Td>
        <Button colorScheme="green">
          <a href={schedule.link}>Open</a>
        </Button>
      </Td>
    </Tr>
  );
};

export default Schedule;
