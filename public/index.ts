import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../public")));

// Store connected users and their usernames
const users: Record<string, string> = {};

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  // Listen for 'user joined' event to get the username
  socket.on("user joined", (username: string) => {
    users[socket.id] = username;
    io.emit("chat message", `${username} has joined the chat!`);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      console.log(`${username} disconnected`);
      io.emit("chat message", `${username} has left the chat.`);
      delete users[socket.id]; // Remove user from the users object
    }
  });

  socket.on("chat message", (msg: string) => {
    const username = users[socket.id];
    console.log(`message from ${username}: ${msg}`);
    io.emit("chat message", `${username}: ${msg}`);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
