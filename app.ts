import express, { Request, Response } from 'express'
import { getVideoRoutes } from './src/routes/videos'
import { db } from './src/repositories/VideosRepository'
import { getTestRouter } from './src/routes/tests'

export const app = express()

export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use('/videos', getVideoRoutes(db))
app.use('/__test__', getTestRouter(db))
