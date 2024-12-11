import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import Header from "./components/Header";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import WorkplacePage from "./pages/WorkplacePage";
import AdminPage from "./pages/AdminPage";
import NotificationsPage from "./pages/NotificationsPage";
import NoticePage from "./pages/NoticePage";
import AssignmentPage from "./pages/AssignmentPage";
import SubmissionPage from "./pages/SubmissionPage";
import MeetingPage from "./pages/MeetingPage";
import QuizPage from "./pages/QuizPage";
import DivisionHubPage from "./pages/DivisionHubPage";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;
function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <Box position={"relative"}>
      <Container
        maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/notifications"
            element={user ? <NotificationsPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/workspace"
            element={user ? <WorkplacePage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/notices"
            element={user ? <NoticePage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/assignments"
            element={user ? <AssignmentPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/meets"
            element={user ? <MeetingPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/quiz"
            element={user ? <QuizPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/divisionHub"
            element={user ? <DivisionHubPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/submissions/:id"
            element={user ? <SubmissionPage /> : <Navigate to={"/auth"} />}
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/admin"
            element={
              user &&
              user.isVerified &&
              (user.type === "admin" || user.type === "faculty") ? (
                <AdminPage />
              ) : (
                <Navigate to={"/auth"} />
              )
            }
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
