import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";
import axios from "axios";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${username}`);
        if (res.data.isFrozen) {
          return setUser(null);
        }
        setUser(res.data);
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
        setLoading(false);
      }
    };
    getUser();
  }, [username]);
  return { loading, user };
};

export default useGetUserProfile;
