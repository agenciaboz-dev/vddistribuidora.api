"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
// import user from "./src/user"
exports.router = express_1.default.Router();
exports.router.get("/", (req, response) => {
    response.status(200).json({ success: true });
});
// router.use("/user", user)
