"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const io_1 = require("./src/io");
const env_1 = require("./src/env");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use("/api", routes_1.router);
app.use("/static", express_1.default.static("static"));
// whatsapp.client.initialize()
try {
    const server = https_1.default.createServer({
        key: fs_1.default.readFileSync("/etc/letsencrypt/live/app.agencyboz.com/privkey.pem", "utf8"),
        cert: fs_1.default.readFileSync("/etc/letsencrypt/live/app.agencyboz.com/cert.pem", "utf8"),
        ca: fs_1.default.readFileSync("/etc/letsencrypt/live/app.agencyboz.com/fullchain.pem", "utf8"),
    }, app);
    const io = (0, io_1.initializeIoServer)(server);
    io.on("connection", (socket) => {
        (0, io_1.handleSocket)(socket);
    });
    server.listen(port, () => {
        console.log(`[server]: Server is running at https://${port}`);
        (0, env_1.setProd)();
    });
}
catch (e) {
    const server = http_1.default.createServer(app);
    const io = (0, io_1.initializeIoServer)(server);
    io.on("connection", (socket) => {
        (0, io_1.handleSocket)(socket);
    });
    server.listen(port, () => {
        console.log(`[server]: Server is running at http://${port}`);
    });
}
