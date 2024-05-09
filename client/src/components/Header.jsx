import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Flex, Text, Button, Input } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import {
  BsBell,
  BsBellFill,
  BsFillChatQuoteFill,
  BsPersonWorkspace,
} from "react-icons/bs";

import { BiSearch } from "react-icons/bi";
import { MdOutlineSettings } from "react-icons/md";
import useLogout from "../hooks/useLogout";
import { FaUserGraduate } from "react-icons/fa6";
const Header = () => {
  const currentUser = useRecoilValue(userAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { logout } = useLogout();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <Flex
      justifyContent={currentUser ? "space-between" : "center"}
      alignItems={"center"}
      mt={6}
      mb={"12"}
      px={4}
      flexWrap={"wrap"}
    >
      {currentUser && (
        <Flex
          alignItems={"center"}
          gap={2}
          justifyContent={"space-evenly"}
          w={"full"}
          mb={4}
        >
          <Link to={"/notifications"}>
            <BsBellFill size={24} />
          </Link>
          <Link to={`/chat`}>
            <BsFillChatQuoteFill size={24} />
          </Link>
          <Link to={`/${currentUser.username}`}>
            <RxAvatar size={26} />
          </Link>
          {currentUser.isVerified && (
            <Link to={"/workspace"}>
              <BsPersonWorkspace size={24} />
            </Link>
          )}
          <Link to={`/settings`}>
            <MdOutlineSettings size={26} />
          </Link>
        </Flex>
      )}

      <Link to={"/"}>
        <Flex alignItems={"center"} gap={2}>
          <FaUserGraduate size={26} />
          <Text
            cursor={"pointer"}
            fontWeight={"bold"}
            fontSize={"lg"}
            textAlign={"center"}
          >
            CampusAura
          </Text>
        </Flex>
      </Link>

      {currentUser && (
        <form onSubmit={handleSearch}>
          <Flex alignItems={"center"} gap={2} my={2}>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username"
              size="sm"
              borderRadius={"2xl"}
            />
            <Button size={"sm"} type="submit" rounded={"full"}>
              <BiSearch size={24} />
            </Button>
          </Flex>
        </form>
      )}
    </Flex>
  );
};

export default Header;
