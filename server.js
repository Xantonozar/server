//Node server which will handle socket  server connection
const express = require("express");
const app = express();
const port = process.env.PORT|| 3000;
const cors = require("cors");
app.use(cors());
console.log("server running");
const io = require("socket.io")(port, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("new-user-joined", (name) => {
    console.log("new user", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("send", (messages) => {
    socket.broadcast.emit("recieve", {
      messages: messages,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (messages) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
