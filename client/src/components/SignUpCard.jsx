import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Select,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    prn: "",
    branch: "",
    year: "",
    type: "",
    div: "",
  });

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/users/signup", {
        name: inputs.name,
        email: inputs.email,
        username: inputs.username,
        password: inputs.password,
        phone: inputs.phone,
        prn: inputs.prn,
        branch: inputs.branch,
        year: inputs.year,
        type: inputs.type,
        div: inputs.div,
      });

      localStorage.setItem("user-campusaura", JSON.stringify(res.data));
      setUser(res.data);
      showToast("SignUp", "Account created Successfully!", "success");
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
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@vit\.edu$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="fullname" isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="username" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    type="text"
                    onChange={(e) =>
                      setInputs({ ...inputs, username: e.target.value })
                    }
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                isInvalid={inputs.email && !validateEmail(inputs.email)}
              />
              <Text color="red.500" fontSize="sm">
                {inputs.email && !validateEmail(inputs.email)
                  ? "Email should be of type @vit.edu"
                  : ""}
              </Text>
            </FormControl>

            <Box>
              <FormControl id="phone" isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="98XXXXXXXX"
                  onChange={(e) =>
                    setInputs({ ...inputs, phone: e.target.value })
                  }
                  isInvalid={inputs.phone && !validatePhone(inputs.phone)}
                />
                <Text color="red.500" fontSize="sm">
                  {inputs.phone && !validatePhone(inputs.phone)
                    ? "Please enter valid phone number"
                    : ""}
                </Text>
              </FormControl>
            </Box>
            <Box>
              <FormControl id="type" isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  name="type"
                  placeholder="Select type"
                  onChange={(e) =>
                    setInputs({ ...inputs, type: e.target.value })
                  }
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </Select>
                <Text color="green.500" fontSize="sm">
                  {inputs.type
                    ? "Your Account will be checked by admin so choose wisely"
                    : ""}
                </Text>
              </FormControl>
            </Box>

            {inputs.type && inputs.type === "student" && (
              <>
                <HStack>
                  <Box>
                    <FormControl id="year" isRequired>
                      <FormLabel>Year</FormLabel>
                      <Select
                        name="year"
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
                    <FormControl id="branch" isRequired>
                      <FormLabel>Branch</FormLabel>
                      <Select
                        name="branch"
                        placeholder="Select branch"
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
                </HStack>

                <HStack>
                  <Box>
                    <FormControl id="div" isRequired>
                      <FormLabel>Division</FormLabel>
                      <Select
                        name="div"
                        placeholder="Select div"
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
                  <Box>
                    <FormControl id="prn" isRequired>
                      <FormLabel>PRN</FormLabel>
                      <Input
                        name="prn"
                        type="number"
                        onChange={(e) =>
                          setInputs({ ...inputs, prn: e.target.value })
                        }
                      />
                    </FormControl>
                  </Box>
                </HStack>
              </>
            )}

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                isLoading={loading}
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleSignUp}
                disabled={
                  !validateEmail(inputs.email) || !validatePhone(inputs.phone)
                }
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
