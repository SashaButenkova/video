import express, { Request, Response } from 'express'
import { getVideoRoutes } from './routes/videos'
import { db } from './repositories/VideosRepository'
import { getTestingAllDataRouter } from './routes/tests'

export const app = express()

export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use('/videos', getVideoRoutes(db))
app.use('/testing', getTestingAllDataRouter(db))
