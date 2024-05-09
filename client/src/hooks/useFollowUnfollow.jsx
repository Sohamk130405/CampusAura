import React, { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import axios from "axios";

const useFollowUnfollow = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user?.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    if (updating) return;
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    setUpdating(true);
    try {
      // server side follow unfollow
      const res = await axios.post(`/api/users/follow/${user._id}`);

      showToast("Success", res.data.message, "success");
      setFollowing(!following);
    } catch (error) {
      console.log(error);
      // If the error is from the server (e.g., network error, 500 Internal Server Error)
      if (error.response && error.response.data && error.response.data.error) {
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
      setUpdating(false);
    }
  };
  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
