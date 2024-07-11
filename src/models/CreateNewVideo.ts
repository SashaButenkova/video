import { AvailableResolutions } from '../repositories/VideosRepository'

export type CreateVideoModel = {
	title: string
	author: string
	availableResolutions: AvailableResolutions[]
}
