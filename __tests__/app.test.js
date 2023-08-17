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
            const expectedObject = {
                author: 'butter_bridge',
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                topic: 'mitch',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            }
            return request(app)
            .get('/api/articles/1')
            .then(({body: {article}}) => {
                expect(article).toMatchObject(expectedObject);
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
            const expectedObject = {
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
                    expect(comment).toMatchObject(expectedObject);
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
describe('POST `/api/articles/:article_id/comments` tests', () => {
    test('201: returns status code 201 upon successful POST request', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({body: 'test body', author: 'lurker'})
        .expect(201);
    })
    test('201: responds with the posted comment with the required properties', () => {
        const expectedObject = {
            body: 'test body',
            author: 'lurker',
            votes: 0,
            created_at: expect.any(String),
            article_id: 1,
            comment_id: expect.any(Number)
        }

        return request(app)
        .post('/api/articles/1/comments')
        .send({body: 'test body', author: 'lurker'})
        .then(({body: {postedComment}}) => {
            expect(postedComment).toMatchObject(expectedObject);
        });
    })
})
describe('PATCH `/api/articles/:article_id', () => {
    test('200:returns status code 200 upon successful patch request', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes:999})
        .expect(200);
    })
    test('200:returns the updated article upon successful patch request(incrementing votes)', () => {
        const expectedObject = {
            author: 'butter_bridge',
            title:  'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            topic: 'mitch',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 1099,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        };

        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes:999})
        .then(({body: {updatedArticle}}) => {
            expect(updatedArticle).toMatchObject(expectedObject);
        })
    })
    test('200:returns the updated article upon successful patch request(decrementing votes)', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes:-100})
        .then(({body: {updatedArticle}}) => {
            expect(updatedArticle.votes).toEqual(0);
        })
    })
    test('200: returns status code 200 when sent with a valid and existing article id even if the body send have multiple properties(which will be ignored) as long as it contains the required property(inc_votes)', () => { //<---
        return request(app)
        .patch('/api/articles/1')
        .send({test: 'test', inc_votes:999})
        .then(({body: {updatedArticle}}) => {
            expect(updatedArticle.votes).toEqual(1099);
            expect(updatedArticle).not.toHaveProperty('test');
        })
    })
})
describe('DELETE `/api/comments/:comment_id`',() => {
    test('204: returns status code 204 upon successful deletion', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204);
    })
    test('204: returns status code 204 upon successful deletion and no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .then(({body}) => {
            expect(body).toEqual({})
        })
    })
})
describe('GET `/api/users` tests',() => {
    test('200: returns status code 200 upon successful request', () => {
        return request(app)
        .get('/api/users')
        .expect(200);
    })
    test('200: returns an array of objects with certain properties', () => {
        const expectedObject = {
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
        }

        return request(app)
        .get('/api/users')
        .then(({body: {users}}) => {
            expect(users.length).not.toBe(0);
            users.forEach(user => {
                expect(user).toMatchObject(expectedObject);
            })
        })
    })
})
describe('POST `/api/articles` tests',() => {
    // test('201: returns status code upon successful post request', ()=> {
    //     return request(app)
    //     .post('/api/articles')
    //     .send({
    //         author: 'test1',
    //         title: 'test2',
    //         body: 'test3',
    //         topic: 'mitch',
    //         article_img_url: 'test4'
    //     })
    //     .expect(201);
    // })
    // test('201: returns the newly posted article', ()=> {
    //     const expectedObject = {
    //         author: 'test1',
    //         title: 'test2',
    //         body: 'test3',
    //         topic: 'mitch',
    //         created_at: expect.any(String),
    //         votes: 0,
    //         article_img_url: 'test4'
    //     }

    //     return request(app)
    //     .post('/api/articles')
    //     .send({
    //         author: 'test1',
    //         title: 'test2',
    //         body: 'test3',
    //         topic: 'mitch',
    //         article_img_url: 'test4'
    //     })
    //     .then(({body: {postedComment}}) => {
    //         expect(postedComment).toEqual(expectedObject)
    //     });
    // })
    // test('201: returns the newly posted article and will provide a default article_img_url if not provided during request.', ()=> {
    //     const expectedObject = {
    //         author: 'test1',
    //         title: 'test2',
    //         body: 'test3',
    //         topic: 'mitch',
    //         created_at: expect.any(String),
    //         votes: 0,
    //         article_img_url: 'No image provided'
    //     }

    //     return request(app)
    //     .post('/api/articles')
    //     .send({
    //         author: 'test1',
    //         title: 'test2',
    //         body: 'test3',
    //         topic: 'mitch',
    //         article_img_url: 'test4'
    //     })
    //     .then(({body: {postedComment}}) => {
    //         expect(postedComment).toEqual(expectedObject)
    //     });

    // })
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
    describe('PATCH `/api/articles/:article_id` errors', () => {
        test('400: returns status code 400 when sent with an invalid request', () => {
            return request(app)
            .patch('/api/articles/test')
            .send({inc_votes:999})
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Bad Request')
            });
        })

        test('400: returns status code 400 when sent with a valid and existing article id but wrong body property', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({test:999})
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Bad Request')
            });
        })
        test('404: returns status code 404 when sent with a valid but non existing article id', () => {
            return request(app)
            .patch('/api/articles/9999')
            .send({inc_votes:999})
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Not Found')
            })
        })
    })
    describe('DELETE `/api/comments/:comment_id` errors', () => {
        test('400: returns status code 400 when sent with an invalid request', () => {
            return request(app)
            .delete('/api/comments/test')
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Bad Request')
            });
        })
        test('404: returns status code 404 when sent with a valid but non-existent id request', () => {
            return request(app)
            .delete('/api/comments/9999')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Not Found')
            })
        })
    })
    describe('GET `/api/users` errors', () => {
        test('404: returns status code 404 if users data does not exist', () => {
            
            return db
            .query(`DROP TABLE IF EXISTS comments`)
            .then(() => {
                return db.query(`DROP TABLE IF EXISTS articles`)
            })
            .then(() => {
                return db.query(`DROP TABLE IF EXISTS users`)
            })            
            .then(() => {
                return request(app)
                .get('/api/users')
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Not Found')
                })
            })
        })
    })
})