import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Spinner,
  TableCaption,
  Skeleton,
  Td,
  SkeletonCircle,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Submission from "../components/Submission";
const SubmissionPage = ({ assignment }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const getSubmissions = async () => {
      try {
        const res = await axios.get(`/api/assignments/submissions/${id}`);
        console.log(res.data);
        setSubmissions(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getSubmissions();
  }, [setSubmissions, id]);
  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Student</Th>
              <Th>Prn</Th>
              <Th>Uploads</Th>
              <Th isNumeric>Marks</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading &&
              [1, 2, 3, 4, 5].map((e) => (
                <Tr>
                  <Td>
                    <SkeletonCircle size={10} />
                  </Td>
                  <Td>
                    <Skeleton width={200} height={5} />
                  </Td>
                  <Td>
                    <Skeleton width={30} height={30} />
                  </Td>
                  <Td isNumeric>
                    <Skeleton width={50} height={5} />
                  </Td>
                </Tr>
              ))}
            {!loading &&
              submissions &&
              submissions.map((submission) => (
                <Submission submission={submission} key={submission._id} />
              ))}
          </Tbody>
          {!loading && submissions.length === 0 && (
            <TableCaption textAlign={"center"}>No Submissions Yet</TableCaption>
          )}
        </Table>
      </TableContainer>
    </>
  );
};

export default SubmissionPage;
