"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosRepository = exports.db = exports.ResolutionsSet = void 0;
exports.ResolutionsSet = new Set([
    'P144',
    'P240',
    'P360',
    'P480',
    'P720',
    'P1080',
    'P1440',
    'P2160',
]);
exports.db = {
    videos: [
        {
            id: 0,
            title: 'string',
            author: 'string',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            createdAt: '2024-02-03T10:07:33.179Z',
            publicationDate: '2024-02-03T10:07:33.179Z',
            availableResolutions: ['P144'],
        },
        {
            id: 1,
            title: 'string',
            author: 'string',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: '2024-02-03T10:07:33.179Z',
            publicationDate: '2024-02-03T10:07:33.179Z',
            availableResolutions: ['P144'],
        },
    ],
};
exports.VideosRepository = {
    findVideosById(id) {
        let FindVideo = exports.db.videos.find(v => v.id == id);
        return FindVideo;
    },
    // postVideo(title: string, author: string, availableResolutions: string[]) {
    // 	const createdAt = new Date()
    // 	const publicationDates = new Date()
    // 	publicationDates.setDate(createdAt.getDate())
    // let NewVideo = {
    // 	id: +new Date(),
    // 	createdAt: createdAt.toISOString(),
    // 	publicationDate: publicationDates.toISOString(),
    // 	canBeDownloaded: false,
    // 	minAgeRestriction: null,
    // 	title,
    // 	author,
    // 	availableResolutions,
    // }
    // return NewVideo
};
