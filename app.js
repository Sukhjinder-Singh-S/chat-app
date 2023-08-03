require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

const user = require("./routes/user");
const Message = require("./models/message");
const UserModel = require("./models/user");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/soket.html");
});

const userSocketMap = {};

io.on("connection", function (socket) {
  console.log("A user connected");

  socket.on("new-user-joined", (name) => {
    console.log(`New user joined `, name);
    userSocketMap[name] = socket.id;
    console.log(userSocketMap);
  });

  socket.on("chat message", async (data) => {
    const targetSocketId = userSocketMap[data.targetUsername];
    const check = await UserModel.findOne({ name: data.targetUsername });
    if (!check) {
      io.emit("user-not-found", "user is not registerd");
    }
    if (targetSocketId) {
      io.to(targetSocketId).emit("chat message", data.message);
      await Message.create({ recUserid: check._id, message: data.message });
    } else { 
      io.emit("user-not-found", "user not found");
    }
    // io.emit("chat message", data.message);
  });

  socket.on("disconnect", () => {
    const disconnectedUser = Object.keys(userSocketMap).find(
      (username) => userSocketMap[username] === socket.id
    );
    if (disconnectedUser) {
      delete userSocketMap[disconnectedUser];
    }
  });

  socket.on("error", (error) => {
    console.log("Socket error:", error);
  });
});

app
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(user);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    http.listen(port);
    console.log("<<<<<<<<<< SERVER CONNECTED >>>>>>>>>>");
  })
  .catch((err) => {
    console.log(err);
  });
