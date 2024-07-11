import request from 'supertest'
import { app } from '../../app'

describe('videos', () => {
	beforeAll(async () => {
		await request(app).delete('/__test__/data')
	})

	it('should return 200 and empty array', async () => {
		await request(app).get('/videos').expect(200, [])
	})
})
