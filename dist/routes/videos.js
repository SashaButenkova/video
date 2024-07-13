"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoRoutes = void 0;
const express_1 = __importStar(require("express"));
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
        const createdAt = new Date();
        // const createdAt = function () {
        // 	const date = new Date()
        // 	date.setUTCDate(date.getUTCDate() + 1)
        // 	return date.toISOString()
        // }
        const publicationDates = function () {
            const date = new Date();
            date.setUTCDate(date.getUTCDate() + 1);
            return date.toISOString();
        };
        if (!req.body.title) {
            express_1.response.status(400).send('bad request');
            return;
        }
        const NewVideo = {
            id: +new Date(),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDates(),
            availableResolutions: req.body.availableResolutions,
        };
        db.videos.push(NewVideo);
        res.status(201).json(getVideoViewModel(NewVideo));
    });
    router.delete('/:id', (req, res) => {
        db.videos = db.videos.filter(v => v.id !== +req.params.id);
        if (!req.params.id) {
            express_1.response.status(404).send('not found');
            return;
        }
        res.sendStatus(204);
    });
    router.put('/:id', (req, res) => {
        // if (!req.body.title) {
        // 	response.status(400).send('bad request')
        // 	return
        // }
        // const foundVideo = db.videos.find(v => v.id === +req.params.id)
        // if (!foundVideo) {
        // 	res.sendStatus(404)
        // 	return
        // }
        //title: req.body.title
        // res.send(foundVideo)
        // res.status(204)
        // return
        const videos = db.videos.find(v => v.id === +req.params.id);
        if (!videos) {
            res.sendStatus(404);
            return;
        }
        const UpdateVideoModel = Object.assign({}, videos);
        const id = +req.params.id;
        let error = {
            errorsMessages: [],
        };
        let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate, } = req.body;
        if (!title ||
            typeof title !== 'string' ||
            !title.trim() ||
            title.trim().length > 40) {
            error.errorsMessages.push({
                message: 'Incorrect title',
                field: 'title',
            });
        }
        if (!author ||
            typeof author !== 'string' ||
            !author.trim() ||
            author.trim().length > 20) {
            error.errorsMessages.push({
                message: 'Incorrect author',
                field: 'author',
            });
        }
        if (Array.isArray(availableResolutions)) {
            availableResolutions.map(r => {
                !availableResolutions.includes(r) &&
                    error.errorsMessages.push({
                        message: 'Invalid availableResolutions',
                        field: 'availableResolutions',
                    });
            });
        }
        else {
            availableResolutions = [];
        }
        if (typeof canBeDownloaded === 'undefined') {
            canBeDownloaded = false;
        }
        if (typeof canBeDownloaded != 'boolean') {
            error.errorsMessages.push({
                message: 'Invalid canBeDownloaded',
                field: 'canBeDownloaded',
            });
        }
        const dateInspection = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/gi.test(publicationDate);
        if (typeof publicationDate != 'undefined' && !dateInspection) {
            error.errorsMessages.push({
                message: 'Invalid publicationDate',
                field: 'publicationDate',
            });
        }
        if (typeof minAgeRestriction !== 'undefined' &&
            typeof minAgeRestriction === 'number') {
            minAgeRestriction < 1 ||
                (minAgeRestriction > 18 &&
                    error.errorsMessages.push({
                        message: 'Invalid minAgeRestriction',
                        field: 'minAgeRestriction',
                    }));
        }
        else {
            minAgeRestriction = null;
        }
        if (error.errorsMessages.length) {
            res.status(400).send(error);
            return;
        }
        const videoIndex = db.videos.findIndex(v => v.id == id);
        const video = db.videos.find(v => v.id === id);
        if (!video) {
            res.sendStatus(404);
            return;
        }
        const updateItems = Object.assign(Object.assign({}, video), { canBeDownloaded,
            minAgeRestriction,
            title,
            author, publicationDate: publicationDate
                ? publicationDate
                : video.publicationDate, availableResolutions });
        db.videos.splice(videoIndex, 1, updateItems);
        res.sendStatus(204);
    });
    router.delete('/testing/all-data', (req, res) => {
        db.videos.length = 0;
        res.sendStatus(204);
    });
    return router;
};
exports.getVideoRoutes = getVideoRoutes;
