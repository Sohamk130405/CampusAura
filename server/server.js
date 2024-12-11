const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const noticeRoutes = require("./routes/noticeRoutes.js");
const shareRoutes = require("./routes/shareRoutes.js");
const scheduleRoutes = require("./routes/scheduleRoutes.js");
const assignmentRoutes = require("./routes/assignmentRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const connectDB = require("./database/connectDB.js");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const { app, server } = require("./socket/socket.js");
const { cronJobs } = require("./utils/helpers/cronJob.js");
connectDB();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  credentials: true,
  origin: process.env.CORS_ORIGIN,
  methods: "GET , POST , PUT , PATCH , DELETE , HEAD",
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/controllers/uploads"));

//Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/shares", shareRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/assignments", assignmentRoutes);

cronJobs();
server.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
app.get("/test", (req, res) => {
  res.send("Server is connected successfully!");
});
