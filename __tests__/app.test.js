const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('App Tests', () => {
    describe('GET `/api/topics` tests', () => {
        test('200: returns status code 200 upon successful GET request', () => {
            return request(app)
            .get('/api/topics')
            .expect(200);
        })
        test('200: returns all topics with certain properties upon successful request', () => {
            return request(app)
            .get('/api/topics')
            .then(({body}) => {
                expect(body.length).toBe(3);
                body.forEach(topic => {
                    expect(topic).toHaveProperty('slug');
                    expect(topic).toHaveProperty('description');
                })
            })
        })

    })
    describe('GET `/api/articles/:article_id` tests', () => {
        test('200: returns status code 200 upon successful GET request', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200);
        })
        test('200: returns an article object based on submitted id and will have certain properties', () => {
            return request(app)
            .get('/api/articles/1')
            .then(({body: {article}}) => {
                expect(article).toHaveProperty('author', expect.any(String));
                expect(article).toHaveProperty('title', expect.any(String));
                expect(article).toHaveProperty('body', expect.any(String));
                expect(article).toHaveProperty('topic', expect.any(String))
                expect(article).toHaveProperty('created_at', expect.any(String));
                expect(article).toHaveProperty('votes', expect.any(Number));
                expect(article).toHaveProperty('article_img_url', expect.any(String));
            })
        })

    })
    describe('Error handling tests', () => {
        describe('GET `/api/articles/:article_id` errors', () => {
            test('400: returns status code 400 when sent with an invalid request', () => {
                return request(app)
                .get('/api/articles/test')
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Bad Request')
                });
            })
            test('400: returns status code 400 when sent with a valid but non-existent id request', () => {
                return request(app)
                .get('/api/articles/9999')
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Bad Request')
                })
            })
        })
    })
})