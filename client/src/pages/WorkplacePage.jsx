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
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
const WorkplacePage = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  const bgColor = useColorModeValue("whiteAlpha.900", "gray.dark");
  return (
    <>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        mb={4}
      >
        {user &&
          user.isVerified &&
          (user.type === "faculty" || user.type === "admin") && (
            <Card bg={bgColor}>
              <CardHeader>
                <Heading size="md">Admin Portal</Heading>
              </CardHeader>
              <CardBody>
                <Text>
                  <li>Verification</li> <li>Reports</li> <li>Complaints</li>{" "}
                  <li>Suggesstions</li>
                </Text>
              </CardBody>
              <CardFooter>
                <Button onClick={() => navigate("/admin")}>View here</Button>
              </CardFooter>
            </Card>
          )}
        <Card bg={bgColor}>
          <CardHeader>
            <Heading size="md">Assignments</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              <li>View Assignments</li>
              <li>Send Assignments</li>
            </Text>
          </CardBody>
          <CardFooter>
            <Button onClick={() => navigate("/assignments")}>View here</Button>
          </CardFooter>
        </Card>
        <Card bg={bgColor}>
          <CardHeader>
            <Heading size="md">Meeting</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              <li>Google Meet</li>
              <li>Zoom Meeting</li>
            </Text>
          </CardBody>
          <CardFooter>
            <Button onClick={() => navigate("/meets")}>View here</Button>
          </CardFooter>
        </Card>
        <Card bg={bgColor}>
          <CardHeader>
            <Heading size="md">Quizzes</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              <li>Google Form</li>
              <li>Microsoft Forms</li>
              <li>And many more</li>
            </Text>
          </CardBody>
          <CardFooter>
            <Button onClick={() => navigate("/quiz")}>View here</Button>
          </CardFooter>
        </Card>
        <Card bg={bgColor}>
          <CardHeader>
            <Heading size="md">Notice</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              Send Notice to
              <li>Division</li>
              <li>Branch</li>
              <li>Year</li>
              <li>All of the above</li>
            </Text>
          </CardBody>
          <CardFooter>
            <Button onClick={() => navigate("/notices")}>View here</Button>
          </CardFooter>
        </Card>
        <Card bg={bgColor}>
          <CardHeader>
            <Heading size="md">Division Hub</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              Share what you have with
              <li>Faculty</li>
              <li>Students</li>
            </Text>
          </CardBody>
          <CardFooter>
            <Button onClick={() => navigate("/divisionHub")}>View here</Button>
          </CardFooter>
        </Card>
      </SimpleGrid>
    </>
  );
};

export default WorkplacePage;
