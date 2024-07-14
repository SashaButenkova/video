import express, { Request, Response, Express } from 'express'
import { DBType } from '../repositories/VideosRepository'

export const getTestingAllDataRouter = (db: DBType) => {
	const router = express.Router()

	router.delete('/all-data', (req, res) => {
		db.videos = []
		res.sendStatus(204)
	})
	return router
}
