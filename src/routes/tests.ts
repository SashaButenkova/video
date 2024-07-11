import express, { Request, Response, Express } from 'express'
import { DBType } from '../repositories/VideosRepository'

export const getTestRouter = (db: DBType) => {
	const router = express.Router()

	router.delete('/data', (req, res) => {
		db.videos = []
		res.sendStatus(204)
	})
	return router
}
