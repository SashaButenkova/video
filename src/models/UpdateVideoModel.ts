import { AvailableResolutions } from '../repositories/VideosRepository'
import { VideoViewModel } from './VideoViewModel'

export type UpdateVideoModel = {
	title: string
	author: string
	availableResolutions: AvailableResolutions[]
	canBeDownloaded: boolean
	minAgeRestriction: number | null
	publicationDate: string
}
