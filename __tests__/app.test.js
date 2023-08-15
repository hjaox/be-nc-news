const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const fs = require('fs/promises')

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
                expect(article).toHaveProperty('topic', "mitch");
                expect(article).toHaveProperty('created_at', '2020-07-09T20:11:00.000Z');
                expect(article).toHaveProperty('votes', 100);
                expect(article).toHaveProperty('article_img_url', "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
            })
        })
    })
    describe('GET `/api/articles` tests', () => {
        test('200: returns status code 200 upon successful GET request', () => {
            return request(app)
            .get('/api/articles')
            .expect(200);
        })
        test('200: returns all articles data with certain properties upon successful request', () => {
            const toMatchObject = {
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
            }

            return request(app)
            .get('/api/articles')
            .then(({body: {articles}}) => {
                expect(articles).toBeSortedBy('created_at', {descending:true});
                expect(articles).toEqual(articles.sort((a,b) => b.created_at - a.created_at));
                
                articles.forEach(article => {
                    expect(article).toMatchObject(toMatchObject);
                })
            })
        })
    })
    describe('GET `/api/articles/:article_id/comments` tests', () => {
        test('200: returns status code 200 upon successful GET request', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200);
        })
        test('200: returns an array of comments for the given article_id of which each comment should have certain properties', () => {
            const toMatchObject = {
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number)
            }
            return request(app)
            .get('/api/articles/1/comments')
            .then(({body: {comments}}) => {
                expect(Array.isArray(comments)).toBe(true);
                expect(comments).toBeSortedBy('created_at', {descending: true});
                expect(comments).toEqual(comments.sort((a,b) => b.created_at - a.created_at));
                expect(comments.length).not.toBe(0);

                comments.forEach((comment) => {
                    expect(comment).toMatchObject(toMatchObject);
                })
            })
        })
        test('200: returns an empty array if a certain article does not have comments', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .then(({body: {comments}}) => {
                expect(comments).toEqual([]);
            })
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
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Not Found')
            })
        })
    })
    describe('GET `/api/articles/:article_id/comments` errors', () => {
        test('400: returns status code 400 when sent with an invalid request', () => {
            return request(app)
            .get('/api/articles/test/comments')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Bad Request')
            });
        })
        test('404: returns status code 404 when sent with a valid but non-existent id request', () => {
            return request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Not Found')
            })
        })
    })
})
    
