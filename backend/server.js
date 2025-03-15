const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const db = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/patients", require("./routes/patients"));
app.use("/rooms", require("./routes/rooms"));
app.use("/patientrooms", require("./routes/patientrooms")(io)); // 👈 Pasăm io
app.use("/cam", require("./routes/cam"));

// WebSockets for real-time updates
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
