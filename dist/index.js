"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var server = (0, http_1.createServer)();
var cors = require("cors");
var app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
}));
var io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"],
    },
});
io.on("connection", function (socket) {
    console.log("\u26A1: Un utilisateur connect\u00E9 ".concat(socket.id));
    socket.on("chat-message", function (msg) {
        console.log("Message reçu :", msg);
        io.emit("chat-message", msg);
    });
    socket.on("disconnect", function () {
        console.log("Utilisateur déconnecté");
    });
});
var PORT = process.env.PORT || 4000;
server.listen(PORT, function () {
    console.log("\uD83D\uDE80 Serveur WebSocket lanc\u00E9 sur le port ".concat(PORT));
});
