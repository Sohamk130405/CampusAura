import React, { useEffect, useState } from "react";

import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CreateNotice from "../components/CreateNotice";
import Notice from "../components/Notice";
import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";

const NoticePage = () => {
  const user = useRecoilValue(userAtom);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getNotices = async () => {
      try {
        const res = await axios.get("/api/notices/");

        const filteredNotices = res.data.filter((notice) => {
          return (
            notice.sender === user._id ||
            ((notice.branch === user.branch || notice.branch === "All") &&
              notice.year === user.year) ||
            (notice.year === "All" &&
              (notice.div === user.div || notice.div === "All"))
          );
        });
        setNotices(filteredNotices);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getNotices();
  }, [setNotices]);
  return (
    <>
      {(user.type === "admin" || user.type === "faculty") && <CreateNotice />}
      {loading && <Spinner />}
      {!loading && notices.length === 0 && (
        <Text textAlign={"center"} fontWeight={"bold"}>
          No Notices Are There!
        </Text>
      )}
      <SimpleGrid gap={2} columns={[1, 1, 2, 2]}>
        {!loading &&
          notices &&
          notices.length > 0 &&
          notices.map((notice) => (
            <Notice
              key={notice._id}
              notice={notice}
              user={user}
              setNotices={setNotices}
              setLoading={setLoading}
            />
          ))}
      </SimpleGrid>
    </>
  );
};

export default NoticePage;
