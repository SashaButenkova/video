import express, { Request, Response, Express } from 'express'
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
			if (!req.body.title) {
				res.sendStatus(400)
				return
			}
			const NewVideo: VideoType = {
				id: +new Date(),
				title: req.body.title,
				author: req.body.author,
				canBeDownloaded: true,
				minAgeRestriction: null,
				createdAt: '2024-07-10T17:22:00.900Z',
				publicationDate: '2024-07-10T17:22:00.900Z',
				availableResolutions: req.body.availableResolutions,
			}

			db.videos.push(NewVideo)

			res.status(201).json(getVideoViewModel(NewVideo))
		}
	)

	router.delete('/:id', (req: RequestWithParams<URIParamsVideosModel>, res) => {
		db.videos = db.videos.filter(v => v.id !== +req.params.id)

		if (!req.params.id) {
			res.send(404)
			return
		}

		res.sendStatus(204)
	})

	router.put(
		'/:id',
		(
			req: RequestWithParamsAndBody<URIParamsVideosModel, UpdateVideoModel>,
			res
		) => {
			if (!req.body.title) {
				res.sendStatus(400)
				return
			}

			const foundVideo = db.videos.find(v => v.id === +req.params.id)

			if (!foundVideo) {
				res.sendStatus(404)
				return
			}
			res.sendStatus(204)
		}
	)

	return router
}
