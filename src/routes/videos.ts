import express, { Request, Response, Express, response } from 'express'
import { DBType, VideoType } from '../repositories/VideosRepository'
import { AvailableResolutions } from '../repositories/VideosRepository'

import { VideoViewModel } from '../models/VideoViewModel'
import {
	RequestWithBody,
	RequestWithParams,
	RequestWithParamsAndBody,
	RequestWithQuery,
} from '../types/types'
import { QueryVideoModel } from '../models/QueryVideoModel'
import { URIParamsVideosModel } from '../models/URIParamsVideosIdModel'
import { CreateVideoModel } from '../models/CreateNewVideo'
import { UpdateVideoModel } from '../models/UpdateVideoModel'

const getVideoViewModel = (dbVideo: VideoType): VideoViewModel => {
	return {
		id: dbVideo.id,
		title: dbVideo.title,
		author: dbVideo.author,
		canBeDownloaded: dbVideo.canBeDownloaded,
		minAgeRestriction: dbVideo.minAgeRestriction,
		createdAt: dbVideo.createdAt,
		publicationDate: dbVideo.publicationDate,
		availableResolutions: dbVideo.availableResolutions,
	}
}

export const getVideoRoutes = (db: DBType) => {
	const router = express.Router()

	router.get(
		'/',
		(
			req: RequestWithQuery<QueryVideoModel>,
			res: Response<VideoViewModel[]>
		) => {
			let foundVideo = db.videos
			if (req.query.title) {
				foundVideo = foundVideo.filter(
					v => v.title.indexOf(req.query.title) > -1
				)
			}
			res.json(foundVideo.map(getVideoViewModel))
		}
	)

	router.get(
		'/:id',
		(
			req: RequestWithParams<URIParamsVideosModel>,
			res: Response<VideoViewModel>
		) => {
			const foundVideo = db.videos.find(v => v.id === +req.params.id)
			if (!foundVideo) {
				res.sendStatus(404)
				return
			}

			res.json(getVideoViewModel(foundVideo))
		}
	)

	router.post(
		'/',
		(req: RequestWithBody<CreateVideoModel>, res: Response<VideoViewModel>) => {
			const createdAt = new Date()
			const publicationDates = function () {
				const date = new Date()
				date.setUTCDate(date.getUTCDate() + 1)
				return date.toISOString()
			}
			if (!req.body.title) {
				response.status(400).send('bad request')
				return
			}
			const NewVideo: VideoType = {
				id: +new Date(),
				title: req.body.title,
				author: req.body.author,
				canBeDownloaded: true,
				minAgeRestriction: null,
				createdAt: createdAt.toISOString(),
				publicationDate: publicationDates(),
				availableResolutions: req.body.availableResolutions,
			}

			db.videos.push(NewVideo)

			res.status(201).json(getVideoViewModel(NewVideo))
		}
	)

	router.delete('/:id', (req: RequestWithParams<URIParamsVideosModel>, res) => {
		db.videos = db.videos.filter(v => v.id !== +req.params.id)

		if (!req.params.id) {
			response.status(404).send('not found')
			return
		}

		res.sendStatus(204)
	})

	type errorMessageType = {
		field: string
		message: string
	}

	type errorType = {
		errorsMessages: errorMessageType[]
	}

	router.put(
		'/:id',
		(
			req: RequestWithParamsAndBody<URIParamsVideosModel, UpdateVideoModel>,
			res
		) => {
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

			const videos: VideoType | undefined = db.videos.find(
				v => v.id === +req.params.id
			)

			if (!videos) {
				res.sendStatus(404)
				return
			}

			const UpdateVideoModel: VideoType = {
				...videos,
			}
			const id: number = +req.params.id

			let error: errorType = {
				errorsMessages: [],
			}

			let {
				title,
				author,
				availableResolutions,
				canBeDownloaded,
				minAgeRestriction,
				publicationDate,
			} = req.body

			if (
				!title ||
				typeof title !== 'string' ||
				!title.trim() ||
				title.trim().length > 40
			) {
				error.errorsMessages.push({
					message: 'Incorrect title',
					field: 'title',
				})
			}

			if (
				!author ||
				typeof author !== 'string' ||
				!author.trim() ||
				author.trim().length > 20
			) {
				error.errorsMessages.push({
					message: 'Incorrect author',
					field: 'author',
				})
			}

			if (Array.isArray(availableResolutions)) {
				availableResolutions.map(r => {
					!availableResolutions.includes(r) &&
						error.errorsMessages.push({
							message: 'Invalid availableResolutions',
							field: 'availableResolutions',
						})
				})
			} else {
				availableResolutions = []
			}

			if (typeof canBeDownloaded === 'undefined') {
				canBeDownloaded = false
			}
			if (typeof canBeDownloaded != 'boolean') {
				error.errorsMessages.push({
					message: 'Invalid canBeDownloaded',
					field: 'canBeDownloaded',
				})
			}

			const dateInspection: boolean =
				/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/gi.test(publicationDate)
			if (typeof publicationDate != 'undefined' && !dateInspection) {
				error.errorsMessages.push({
					message: 'Invalid publicationDate',
					field: 'publicationDate',
				})
			}

			if (
				typeof minAgeRestriction !== 'undefined' &&
				typeof minAgeRestriction === 'number'
			) {
				minAgeRestriction < 1 ||
					(minAgeRestriction > 18 &&
						error.errorsMessages.push({
							message: 'Invalid minAgeRestriction',
							field: 'minAgeRestriction',
						}))
			} else {
				minAgeRestriction = null
			}

			if (error.errorsMessages.length) {
				res.status(400).send(error)
				return
			}

			const videoIndex: number = db.videos.findIndex(v => v.id == id)
			const video: VideoType | undefined = db.videos.find(v => v.id === id)

			if (!video) {
				res.sendStatus(404)
				return
			}

			const updateItems: VideoType = {
				...video,
				canBeDownloaded,
				minAgeRestriction,
				title,
				author,
				publicationDate: publicationDate
					? publicationDate
					: video.publicationDate,
				availableResolutions,
			}

			db.videos.splice(videoIndex, 1, updateItems)
			res.sendStatus(204)
		}
	)

	router.delete('/testing/all-data', (req: Request, res: Response) => {
		db.videos.length = 0
		res.sendStatus(204)
	})

	return router
}
