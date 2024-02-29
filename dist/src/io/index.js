"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocket = exports.getIoInstance = exports.initializeIoServer = void 0;
const socket_io_1 = require("socket.io");
const User_1 = require("../../src/class/User");
const Person_1 = require("../../src/class/Person");
let io = null;
const initializeIoServer = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: "*" },
        maxHttpBufferSize: 1e8,
    });
    return io;
};
exports.initializeIoServer = initializeIoServer;
const getIoInstance = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized. Please call initializeIoServer first.");
    }
    return io;
};
exports.getIoInstance = getIoInstance;
const handleSocket = (socket) => {
    console.log(`new connection: ${socket.id}`);
    socket.on("disconnect", (reason) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`disconnected: ${socket.id}`);
    }));
    socket.on("user:login", (data) => User_1.User.login(socket, data));
    socket.on("user:signup", (data) => User_1.User.signup(socket, data));
    socket.on("person:register", (data) => Person_1.Person.register(socket, data));
    socket.on("person:list", () => Person_1.Person.list(socket));
    socket.on("person:find", (id) => Person_1.Person.find(socket, id));
};
exports.handleSocket = handleSocket;
exports.default = { initializeIoServer: exports.initializeIoServer, getIoInstance: exports.getIoInstance, handleSocket: exports.handleSocket };
