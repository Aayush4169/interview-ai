// require("dotenv").config();
// const app = require("./src/app");

// const connectToDB = require("./src/config/database");

// connectToDB();

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, (req, res) => {
//   console.log("Server is running on port 3000");
// });

require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const liveQuizSocket = require("./src/socket/liveQuiz.socket");

connectToDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

liveQuizSocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
