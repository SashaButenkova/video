"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const getVideoViewModel = (dbVideo) => {
    return {
        id: dbVideo.id,
        title: dbVideo.title,
        author: dbVideo.author,
        canBeDownloaded: dbVideo.canBeDownloaded,
        minAgeRestriction: dbVideo.minAgeRestriction,
        createdAt: dbVideo.createdAt,
        publicationDate: dbVideo.publicationDate,
        availableResolutions: dbVideo.availableResolutions,
    };
};
const getVideoRoutes = (db) => {
    const router = express_1.default.Router();
    router.get('/', (req, res) => {
        let foundVideo = db.videos;
        if (req.query.title) {
            foundVideo = foundVideo.filter(v => v.title.indexOf(req.query.title) > -1);
        }
        res.json(foundVideo.map(getVideoViewModel));
    });
    router.get('/:id', (req, res) => {
        const foundVideo = db.videos.find(v => v.id === +req.params.id);
        if (!foundVideo) {
            res.sendStatus(404);
            return;
        }
        res.json(getVideoViewModel(foundVideo));
    });
    router.post('/', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(400);
            return;
        }
        const NewVideo = {
            id: +new Date(),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: '2024-07-10T17:22:00.900Z',
            publicationDate: '2024-07-10T17:22:00.900Z',
            availableResolutions: req.body.availableResolutions,
        };
        db.videos.push(NewVideo);
        res.status(201).json(getVideoViewModel(NewVideo));
    });
    router.delete('/:id', (req, res) => {
        db.videos = db.videos.filter(v => v.id !== +req.params.id);
        if (!req.params.id) {
            res.send(404);
            return;
        }
        res.sendStatus(204);
    });
    router.put('/:id', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(400);
            return;
        }
        const foundVideo = db.videos.find(v => v.id === +req.params.id);
        if (!foundVideo) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    });
    return router;
};
exports.getVideoRoutes = getVideoRoutes;
