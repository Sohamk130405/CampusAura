import React, { useEffect, useState } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postAtom);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getfeedPosts = async () => {
      setPosts([]);
      setLoading(true);
      try {
        const res = await axios.get("/api/posts/feed");
        setPosts(res.data);
      } catch (error) {
        setUser(null);
        localStorage.removeItem("user-campusaura");
        setPosts([]);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };
    getfeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        {loading && (
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {!loading && posts.length === 0 && (
          <Flex justifyContent={"center"} alignItems={"center"}>
            <h1>Follow Some Users To See Feed</h1>
          </Flex>
        )}
        {posts &&
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers navigate={navigate} setUser={setUser} />
      </Box>
    </Flex>
  );
};

export default HomePage;
