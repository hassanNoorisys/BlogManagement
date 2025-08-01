import request from 'supertest'
import app from '../../app.js'

describe('GET /api/blog', () => {

    it('Should return 404 if blogs not found', async () => {

        const res = await request(app).get('/api/blog/').query({ title: 'random' })

        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe('Blog not found')
        expect(res.body.data).toBeUndefined();
    })

    it('Should return all the blogs', async () => {

        const res = await request(app).get('/api/blog/').query({ page: 1, size: 5 })

        // console.log('blog test --> ', typeof res.body.data.blogs, res.body.data)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body.data.blogs)).toBe(true)
        
    })
})