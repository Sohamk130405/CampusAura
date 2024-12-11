import { Box, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import Verification from "../components/Verification";

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState("verification");
  return (
    <Flex flexDir={"column"} w={"full"} gap={4}>
      <AdminHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === "verification" && <Verification />}
    </Flex>
  );
};

export default AdminPage;
