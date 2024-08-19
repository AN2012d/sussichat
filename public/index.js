"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var path_1 = require("path");
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server);
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on("disconnect", function () {
        console.log("User disconnected");
    });
    socket.on("chat message", function (msg) {
        console.log("message: " + msg);
        io.emit("chat message", msg);
    });
});
app.get("/", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "../public", "index.html"));
});
var PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
