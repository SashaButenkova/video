"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestRouter = void 0;
const express_1 = __importDefault(require("express"));
const getTestRouter = (db) => {
    const router = express_1.default.Router();
    router.delete('/data', (req, res) => {
        db.videos = [];
        res.sendStatus(204);
    });
    return router;
};
exports.getTestRouter = getTestRouter;
