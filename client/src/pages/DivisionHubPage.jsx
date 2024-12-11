import React, { useEffect, useState } from "react";

import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import ShowShares from "../components/ShowShares";
import axios from "axios";

const DivisionHubPage = () => {
  const user = useRecoilValue(userAtom);
  const [divInfo, setDivInfo] = useState({
    div: "",
    branch: "",
    year: "",
  });
  const [div, setDiv] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [searched, SetSearched] = useState(false);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);

  const getShares = async (div, branch, year) => {
    setLoading(true);
    try {
      SetSearched(true);
      const res = await axios.get(`/api/shares/${div}/${branch}/${year}`);
      setShares(res.data);
      setDivInfo({ div, branch, year });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user.type === "student") {
      getShares(user.div, user.branch, user.year);
    }
  }, [setShares]);

  const handleSearch = () => {
    getShares(div, branch, year);
  };
  return (
    <>
      <Heading textAlign={"center"} fontSize={"2xl"} mb={4}>
        Division Hub
      </Heading>

      {user.type === "faculty" && (
        <form onSubmit={handleSearch}>
          <Flex flexDir={"column"} gap={2} mb={4}>
            <HStack>
              <FormControl>
                <Select
                  onChange={(e) => setDiv(e.target.value)}
                  placeholder="Select Division"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Select Year"
                >
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Third">Third</option>
                  <option value="Fourth">Fourth</option>
                </Select>
              </FormControl>
            </HStack>
            <FormControl>
              <Select
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Select Branch"
              >
                <option value="Computer Engineering">
                  Computer Engineering
                </option>
                <option value="Computer Science AI">Computer Science AI</option>
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
            <Button
              bg={useColorModeValue("gray.300", "gray.dark")}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Flex>
        </form>
      )}
      <ShowShares
        searched={searched}
        shares={shares}
        loading={loading}
        setShares={setShares}
        setLoading={setLoading}
        divInfo={divInfo}
      />
    </>
  );
};

export default DivisionHubPage;
