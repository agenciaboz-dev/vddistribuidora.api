"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProd = exports.env = void 0;
exports.env = "dev";
const setProd = () => {
    exports.env = "prod";
};
exports.setProd = setProd;
