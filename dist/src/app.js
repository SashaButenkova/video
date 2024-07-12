"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.jsonBodyMiddleware = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const videos_1 = require("../routes/videos");
const VideosRepository_1 = require("../repositories/VideosRepository");
const tests_1 = require("../routes/tests");
exports.app = (0, express_1.default)();
exports.jsonBodyMiddleware = express_1.default.json();
exports.app.use(exports.jsonBodyMiddleware);
exports.app.use('/videos', (0, videos_1.getVideoRoutes)(VideosRepository_1.db));
exports.app.use('/__test__', (0, tests_1.getTestRouter)(VideosRepository_1.db));