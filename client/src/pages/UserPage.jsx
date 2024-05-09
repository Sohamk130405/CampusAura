import { React, useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { Spinner, Flex } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
const UserPage = () => {
  const { username } = useParams();
  const showToast = useShowToast();
  const { loading, user } = useGetUserProfile();
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [posts, setPosts] = useRecoilState(postAtom);
  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setPosts([]);
      setFetchingPosts(true);
      try {
        const res = await axios.get(`/api/posts/user/${username}`);
        setPosts(res.data);
      } catch (error) {
        console.log(error);
        // If the error is from the server (e.g., network error, 500 Internal Server Error)
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
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
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [username, setPosts, showToast, user]);
  if (loading && !user) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <h1>User Not found!</h1>
      </Flex>
    );
  }

  return (
    <>
      <UserHeader user={user} />
      {fetchingPosts && (
        <Flex justifyContent={"center"} alignItems={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {!fetchingPosts && posts.length === 0 && (
        <Flex justifyContent={"center"} alignItems={"center"}>
          <h1>User does not have any post!</h1>
        </Flex>
      )}

      {posts &&
        posts.map((post) => (
          <Post post={post} postedBy={user._id} key={post._id} />
        ))}
    </>
  );
};

export default UserPage;
