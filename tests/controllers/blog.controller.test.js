import request from 'supertest'
import app from '../../app.js'

describe('GET /api/blog', () => {

    it('Should return all the blogs', async () => {

        const res = await request(app).get('/api/blog/').query({})

        // console.log('blog test --> ', typeof res.body.data.blogs, res.body.data)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body.data.blogs)).toBe(true)
    })
})