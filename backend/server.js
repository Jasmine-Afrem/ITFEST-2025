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
    origin: "*", // Allows connections from any origin
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors()); // Enables CORS for all origins
app.use(bodyParser.json());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/patients", require("./routes/patients"));
app.use("/rooms", require("./routes/rooms"));

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
