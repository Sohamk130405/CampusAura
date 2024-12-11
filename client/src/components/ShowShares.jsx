import { React, useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Shares from "./Shares";
import CreateShare from "./CreateShare";

const ShowShares = ({
  shares,
  loading,
  setShares,
  setLoading,
  searched,
  divInfo,
}) => {
  const user = useRecoilValue(userAtom);

  return (
    <>
      {loading && <Spinner />}
      {!loading && shares.length === 0 && !searched && (
        <Text textAlign={"center"} fontWeight={"semibold"}>
          Select Above fields
        </Text>
      )}
      {!loading && shares.length === 0 && searched && (
        <Text textAlign={"center"} fontWeight={"bold"}>
          No Shares Are There!
        </Text>
      )}
      <Flex
        position={"relative"}
        direction={"column"}
        p={2}
        rounded={"md"}
        overflowY={"auto"}
        h={!loading ? "600px" : ""}
        bg={useColorModeValue("gray.100", "black")}
      >
        {!loading &&
          shares &&
          shares.length > 0 &&
          shares.map((share) => (
            <Shares
              key={share._id}
              share={share}
              user={user}
              setShares={setShares}
              setLoading={setLoading}
            />
          ))}
        <CreateShare user={user} divInfo={divInfo} setShares={setShares} />
      </Flex>
      {}
    </>
  );
};

export default ShowShares;
