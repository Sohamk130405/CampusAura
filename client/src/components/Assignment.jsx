import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Box,
  Text,
  Avatar,
  Button,
  Heading,
  Image,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiDetail, BiFile, BiUpvote } from "react-icons/bi";
import axios from "axios";
import CreateSubmission from "./CreateSubmission";
import UpdateAssignment from "./UpdateAssigment";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import ViewVotes from "./ViewVotes";
const Assignment = ({ assignment, user, setAssignments }) => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const deleteAssignment = async () => {
    try {
      if (!window.confirm("Do you want to delete this assignment?")) {
        return;
      }
      const res = await axios.delete(`/api/assignments/${assignment._id}`);

      if (res.data.success) {
        setAssignments((prev) => prev.filter((p) => p._id !== assignment._id));
        showToast("Success", "Assignment deleted successfully!");
      } else {
        showToast(
          "Error",
          "Failed to delete assignment. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      showToast(
        "Error",
        "An unexpected error occurred. Please try again later."
      );
    }
  };

  const handleVoteExtend = async () => {
    try {
      if (
        !window.confirm("Are you sure, you want to vote for extend deadline?")
      ) {
        return;
      }
      if (assignment.extendRequests.includes(user._id)) {
        return showToast("Error", "You already voted", "error");
      }
      const res = await axios.put(`/api/assignments/${assignment._id}`, {
        extendReq: user._id,
      });
      if (res.data.success) {
        showToast(
          "Success",
          "You voted for extend deadline successfully!",
          "success"
        );
      } else {
        showToast("Error", "Failed to vote. Please try again later.", "error");
      }
    } catch (error) {
      console.error("Error voting for extend:", error);
      showToast(
        "Error",
        "An unexpected error occurred. Please try again later.",
        "error"
      );
    }
  };

  return (
    <Card
      maxW="md"
      shadow={"xl"}
      mt={2}
      bg={useColorModeValue("gray.100", "gray.dark")}
    >
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              name={assignment.faculty.name}
              src={assignment.faculty.profilePic}
            />

            <Box>
              <Heading size="sm">{assignment.faculty.name}</Heading>
              <Text fontWeight={"bold"}>{assignment.subject}</Text>
              <Text fontSize="sm" fontWeight={"semibold"}>
                {assignment.div} , {assignment.branch} , {assignment.year} Year
              </Text>
              <Text fontSize={"xs"}>
                Created at :{" "}
                {new Date(assignment.createdAt).toLocaleDateString("en-IN", {
                  weekday: "long", // Display full weekday name
                  day: "numeric", // Display day of the month
                  month: "long", // Display full month name
                  year: "numeric", // Display full year
                })}
              </Text>
            </Box>
          </Flex>

          {user.type === "faculty" && assignment.faculty._id === user._id && (
            <Menu>
              <MenuButton>
                <BsThreeDotsVertical />
              </MenuButton>
              <Portal>
                <MenuList bgColor={"gray.dark"}>
                  <MenuItem>
                    <UpdateAssignment assignment={assignment} />
                  </MenuItem>
                  <MenuItem onClick={deleteAssignment}>Delete</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>{assignment.text}</Text>
      </CardBody>
      {assignment.img && (
        <Image objectFit="cover" alt="Chakra UI" src={assignment.img} />
      )}
      <Text textAlign={"center"} fontWeight={"bold"} color="red">
        {new Date(assignment.deadline).toLocaleDateString("en-IN", {
          weekday: "long", // Display full weekday name
          day: "numeric", // Display day of the month
          month: "long", // Display full month name
          year: "numeric", // Display full year
        })}
      </Text>

      {new Date(assignment.deadline).getTime() < Date.now() && (
        <Text textAlign={"center"} fontWeight={"bold"} color="red">
          Deadline Expired
        </Text>
      )}

      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        gap={2}
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        {console.log(new Date(assignment.deadline).getTime(), Date.now())}
        {user.type === "student" &&
          new Date(assignment.deadline).getTime() > Date.now() && (
            <CreateSubmission
              assignId={assignment._id}
              isSubmitted={assignment.isSubmitted}
            />
          )}
        {assignment.file && (
          <Button
            flex="1"
            variant="ghost"
            colorScheme="yellow"
            leftIcon={<BiFile />}
          >
            <a href={axios.defaults.baseURL + "/uploads/" + assignment.file}>
              Attachments
            </a>
          </Button>
        )}
        {user.type === "student" ? (
          <Button
            flex="1"
            variant="ghost"
            colorScheme="blue"
            leftIcon={<BiUpvote />}
            onClick={handleVoteExtend}
          >
            Vote Extend
          </Button>
        ) : (
          <>
            <ViewVotes
              votes={assignment.extendRequests.length}
              total={assignment.sendTo.length}
            />

            <Button
              flex="1"
              variant="ghost"
              colorScheme="green"
              leftIcon={<BiDetail />}
              onClick={() => {
                navigate(`/submissions/${assignment._id}`);
              }}
            >
              View Submissions
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default Assignment;
