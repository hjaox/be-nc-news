const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const fs = require('fs/promises');
const { send } = require('process');

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
    describe('GET `/api` tests',() => {
        test('200: returns a status code of 200 upon successful GET request', () => {
            return request(app)
            .get('/api')
            .expect(200);
        })
        test('200: returns an object with description', () => {
            return request(app)
            .get('/api')
            .then(({body: {endpoints}}) => {
                fs.readFile('./endpoints.json', 'utf-8')
                .then((expectedData) => {
                   expect(JSON.parse(expectedData)).toEqual(endpoints)
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
                expect(article).toHaveProperty('author', 'butter_bridge');
                expect(article).toHaveProperty('title', "Living in the shadow of a great man");
                expect(article).toHaveProperty('body', "I find this existence challenging");
                expect(article).toHaveProperty('topic', "mitch")
                expect(article).toHaveProperty('created_at', '2020-07-09T20:11:00.000Z');
                expect(article).toHaveProperty('votes', 100);
                expect(article).toHaveProperty('article_img_url', "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
            })
        })

    })
    describe('POST `/api/articles/:article_id/comments` tests', () => {
        test('201: returns status code 200 upon successful POST request', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({body: 'test body', author: 'lurker'})
            .expect(201);
        })
        test('201: responds with the posted comment with the required properties', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({body: 'test body', author: 'lurker'})
            .then(({body: {postedComment}}) => {
                expect(postedComment).toHaveProperty('body', 'test body');
                expect(postedComment).toHaveProperty('author', 'lurker');
                expect(postedComment).toHaveProperty('votes', 0);
                expect(postedComment).toHaveProperty('created_at', expect.any(String));
                expect(postedComment).toHaveProperty('article_id', 1);
                expect(postedComment).toHaveProperty('comment_id', expect.any(Number));
            });
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
            test('404: returns status code 400 when sent with a valid but non-existent id request', () => {
                return request(app)
                .get('/api/articles/9999')
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Not Found')
                })
            })
        })
        describe('POST `/api/articles/:article_id/comments` errors', () => {
            test('400: returns status code 400 when sent with an invalid request', () => {
                return request(app)
                .post('/api/articles/test/comments')
                .send({body: 'test body', author: 'lurker'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Bad Request')
                });
            })
            test('400: returns status code 400 when sent with a valid article_id but does not match the required properties of the body', () => {
                return request(app)
                .post('/api/articles/9999/comments')
                .send({test: 'test body', author: 'lurker'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Bad Request')
                })
            })
            test('404: returns status code 404 when sent with a valid but non-existent id request', () => {
                return request(app)
                .post('/api/articles/9999/comments')
                .send({body: 'test body', author: 'lurker'})
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Not Found')
                })
            })
            
        })
    })
})