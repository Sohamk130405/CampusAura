"use client";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  HStack,
  Box,
  Select,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
export default function UpdateProfilePage() {
  const showToast = useShowToast();
  const [user, setUser] = useRecoilState(userAtom);
  const [updating, setUpdating] = useState(false);
  const fileRef = useRef(null);
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePic: user.profilePic,
    password: "",
    linkedIn: user.linkedIn,
    phone: user.phone,
    prn: user.prn,
    branch: user.branch,
    year: user.year,
    div: user.div,
  });

  const handleSubmit = async (e) => {
    if (updating) return;
    setUpdating(true);
    e.preventDefault();
    try {
      const res = await axios.put(`/api/users/update/${user._id}`, {
        name: inputs.name,
        username: inputs.username,
        email: inputs.email,
        bio: inputs.bio,
        profilePic: imgUrl,
        phone: inputs.phone,
        prn: inputs.prn,
        branch: inputs.branch,
        password: inputs.password,
        linkedIn: inputs.linkedIn,
        div: inputs.div,
        year: inputs.year,
      });
      setUser(res.data);
      showToast("Update", "Profile Updated Successfully!", "success");
      localStorage.setItem("user-campusaura", JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
      // If the error is from the server (e.g., network error, 500 Internal Server Error)
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
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>

          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  src={imgUrl || user.profilePic}
                  boxShadow={"md"}
                />
              </Center>
              <Center w="full" display={"flex"} gap={2}>
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Profile Pic
                </Button>

                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Fullname</FormLabel>
            <Input
              value={inputs.name}
              placeholder="John Doe"
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              value={inputs.username}
              placeholder="johndoe"
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              value={inputs.email}
              placeholder="johndoe@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </FormControl>

          <Box>
            <FormControl id="phone">
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                value={inputs.phone}
                name="phone"
                onChange={(e) =>
                  setInputs({ ...inputs, phone: e.target.value })
                }
              />
            </FormControl>
          </Box>
          {user.type && user.type === "student" && (
            <Box>
              <FormControl id="prn">
                <FormLabel>PRN</FormLabel>
                <Input
                  name="prn"
                  type="number"
                  value={inputs.prn}
                  onChange={(e) =>
                    setInputs({ ...inputs, prn: e.target.value })
                  }
                />
              </FormControl>
            </Box>
          )}

          {user.type && user.type === "student" && (
            <HStack>
              <Box>
                <FormControl id="year">
                  <FormLabel>Year</FormLabel>
                  <Select
                    name="year"
                    value={inputs.year}
                    placeholder="Year"
                    onChange={(e) =>
                      setInputs({ ...inputs, year: e.target.value })
                    }
                  >
                    <option value="First">First</option>
                    <option value="Second">Second</option>
                    <option value="Third">Third</option>
                    <option value="Fourth">Fourth</option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="branch">
                  <FormLabel>Branch</FormLabel>
                  <Select
                    name="branch"
                    placeholder="Select branch"
                    value={inputs.branch}
                    onChange={(e) =>
                      setInputs({ ...inputs, branch: e.target.value })
                    }
                  >
                    <option value="Computer Engineering">
                      Computer Engineering
                    </option>
                    <option value="Computer Science AI">
                      Computer Science AI
                    </option>
                    <option value="Computer Science AIML">
                      Computer Science AIML
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="AI and DS">AI and DS</option>
                    <option value="Electronics And Telecommunication">
                      Electronics and Telecommunication
                    </option>
                    <option value="Mechnical Engineering">
                      Mechnical Engineering
                    </option>
                    <option value="Instrumentation">Instrumentation</option>
                    <option value="Chemical Engineering">
                      Chemical Engineering
                    </option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="div">
                  <FormLabel>Division</FormLabel>
                  <Select
                    value={inputs.div}
                    name="div"
                    placeholder="div"
                    onChange={(e) =>
                      setInputs({ ...inputs, div: e.target.value })
                    }
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </Select>
                </FormControl>
              </Box>
            </HStack>
          )}
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              value={inputs.bio}
              placeholder="Your bio..."
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>LinkedIn profile link</FormLabel>
            <Input
              value={inputs.linkedIn}
              placeholder={"www.linkedin.com/in/username"}
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) =>
                setInputs({ ...inputs, linkedIn: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              value={inputs.password}
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
