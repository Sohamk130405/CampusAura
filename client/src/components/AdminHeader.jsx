import { Flex, Text } from "@chakra-ui/react";

const AdminHeader = ({ selectedTab, setSelectedTab }) => {
  return (
    <Flex w={"full"} overflow={"auto"} gap={2}>
      <Flex
        flex={1}
        borderBottom={
          selectedTab === "verification" ? "1px solid" : "1px solid gray"
        }
        justifyContent={"center"}
        pb={3}
        cursor={"pointer"}
        color={selectedTab === "verification" ? "" : "gray.light"}
        onClick={() => setSelectedTab("verification")}
      >
        <Text fontWeight={"bold"}>Verification</Text>
      </Flex>
    </Flex>
  );
};

export default AdminHeader;
