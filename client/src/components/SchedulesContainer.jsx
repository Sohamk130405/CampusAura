import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  SkeletonCircle,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import Schedule from "./Schedule";
import CreateSchedule from "./CreateSchedule";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
const SchedulesContainer = ({ type }) => {
  const user = useRecoilValue(userAtom);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getSchedules = async () => {
      try {
        const res = await axios.get(`/api/schedules/${type}`);
        console.log(res.data);
        const filteredShedules = res.data.filter((schedule) => {
          return (
            schedule.faculty._id === user._id ||
            ((schedule.branch === user.branch || schedule.branch === "All") &&
              schedule.year === user.year) ||
            (schedule.year === "All" &&
              (schedule.div === user.div || schedule.div === "All"))
          );
        });
        setSchedules(filteredShedules);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getSchedules();
  }, [setSchedules]);
  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Faculty</Th>
              <Th>Subject</Th>
              <Th>Time</Th>
              <Th isNumeric>Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading &&
              [1, 2, 3, 4, 5].map((e) => (
                <Tr key={e}>
                  <Td>
                    <SkeletonCircle size={10} />
                  </Td>
                  <Td>
                    <Skeleton width={200} height={5} />
                  </Td>
                  <Td isNumeric>
                    <Skeleton width={50} height={5} />
                  </Td>
                  <Td>
                    <Skeleton width={50} height={30} />
                  </Td>
                </Tr>
              ))}
            {!loading &&
              schedules &&
              schedules.map((schedule) => (
                <Schedule schedule={schedule} key={schedule._id} />
              ))}
          </Tbody>
          {!loading && schedules.length === 0 && (
            <TableCaption textAlign={"center"}>
              No {type} scheduled yet
            </TableCaption>
          )}
        </Table>
      </TableContainer>
      {user.type === "faculty" && (
        <CreateSchedule
          type={type}
          title={"Schedule Meet"}
          deadLineOrSchedule={"Schedule"}
        />
      )}
    </>
  );
};

export default SchedulesContainer;
