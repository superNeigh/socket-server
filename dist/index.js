"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_1 = require("./config/socket");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Configuration WebSocket
(0, socket_1.setupSocket)(server);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
