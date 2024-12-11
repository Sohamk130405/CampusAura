import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Assignment from "../components/Assignment";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CreateAssignment from "../components/CreateAssignment";

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const getAssignments = async () => {
      try {
        const res = await axios.get("/api/assignments/");
        console.log(res.data);
        setAssignments(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getAssignments();
  }, [setAssignments]);

  return (
    <>
      {user.type === "faculty" && <CreateAssignment />}
      <Heading textAlign={"center"} m={2}>
        Assignments
      </Heading>

      <Flex flexDir={"column"} gap={2}>
        {!loading &&
          assignments.length > 0 &&
          assignments.map((assignment) => (
            <Box alignSelf={"center"} key={assignment._id}>
              <Assignment
                assignment={assignment}
                user={user}
                setAssignments={setAssignments}
              />
            </Box>
          ))}

        {!loading && assignments.length === 0 && (
          <Text textAlign={"center"} fontWeight={"semibold"} m={2}>
            Currently no assignments are there contact your respective faculties
          </Text>
        )}
      </Flex>
    </>
  );
};

export default AssignmentPage;
