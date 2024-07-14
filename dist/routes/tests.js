"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestingAllDataRouter = void 0;
const express_1 = __importDefault(require("express"));
const getTestingAllDataRouter = (db) => {
    const router = express_1.default.Router();
    router.delete('/all-data', (req, res) => {
        db.videos = [];
        res.sendStatus(204);
    });
    return router;
};
exports.getTestingAllDataRouter = getTestingAllDataRouter;
