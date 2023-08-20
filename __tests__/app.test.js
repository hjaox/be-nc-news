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
                expect(typeof article).toBe('object');
                expect(article).toMatchObject(expectedObject);
            })
        })
        describe('Added Feature: GET `/api/articles/:article_id` tests', () => {
            test('added comment_count to articles which is the total count of all the comments with the article_id requested', () => {
                return request(app)
                .get('/api/articles/1')
                .then(({body: {article}}) => {
                    expect(typeof article).toBe('object');
                    expect(article).toHaveProperty('comment_count', 11);
                })
            })
            test('returns a 0 when an article has no comments', () => {
                return request(app)
                .get('/api/articles/2')
                .then(({body: {article}}) => {
                    expect(typeof article).toBe('object');
                    expect(article).toHaveProperty('comment_count', 0);
                })
            })
        })
    })
    describe('GET `/api/articles` tests', () => {
        test('200: returns status code 200 upon successful GET request', () => {
            return request(app)
            .get('/api/articles')
            .expect(200);
        })
        test('200: returns all articles data with certain properties upon successful request sorted by date in descending order', () => {
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
        describe('Added Feature: GET `/api/articles` test', () => {
            test('topic query: filters the articles by topic value specified in the query.', () => {
                return request(app)
                .get('/api/articles?topic=mitch')
                .then(({body: {articles}}) => {
                    expect(articles.length).toBe(10);
                    articles.forEach(article => {
                        expect(article.topic).toBe('mitch');
                    })
                })
            })
            test('topic query: filters the articles by topic value specified in the query and is not case-sensitive.', () => {
                return request(app)
                .get('/api/articles?topic=MiTcH')
                .then(({body: {articles}}) => {
                    expect(articles.length).toBe(10);
                    articles.forEach(article => {                        
                        expect(article.topic).toBe('mitch');
                    })
                })
            })            
            test('sort_by query: sorts the articles by any valid column(defaults to created_at)', () => {
                return request(app)
                .get('/api/articles?sort_by=title')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(10);
                    expect(articles).toBeSortedBy('title', {descending: true});
                })
            })
            test('sort_by query: sorts the articles by any valid column paired with topic query', () => {
                return request(app)
                .get('/api/articles?topic=mitch&sort_by=title')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(10);
                    expect(articles).toBeSortedBy('title', {descending: true});
                    
                    articles.forEach(article => {
                        expect(article.topic).toBe('mitch');
                    })
                })
            })
            test('order query: can be set to asc for ascending', () => {
                return request(app)
                .get('/api/articles?sort_by=article_id&order=asc')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(10);
                    expect(articles).toBeSortedBy('article_id', {descending: false});
                })
            })
            test('order query: can be set to desc for descending', () => {
                return request(app)
                .get('/api/articles?sort_by=article_id&order=desc')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(10);
                    expect(articles).toBeSortedBy('article_id', {descending: true});
                })
            })
            test('order query: defaults to descending', () => {
                return request(app)
                .get('/api/articles?sort_by=article_id')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(10);
                    expect(articles).toBeSortedBy('article_id', {descending: true});
                })
            })
            test('limit query: limits the number of responses(defaults to 10)', () => {
                return request(app)
                .get('/api/articles')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(10);
                })
            })
            test('limit query: limits the number of responses(specified to 5)', () => {
                return request(app)
                .get('/api/articles?limit=5')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(5);
                })
            })
            test('p query: page, specifies the page at which to start(page 1, limit 5)', () => {
                return request(app)
                .get('/api/articles?limit=5&p=1')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(5);
                })
            })
            test('p query: page, specifies the page at which to start(page 2, limit 5)', () => {
                return request(app)
                .get('/api/articles?limit=5&p=2')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(5);
                })
            })
            test('p query: page, specifies the page at which to start(page 3, limit 5)', () => {
                return request(app)
                .get('/api/articles?limit=5&p=3')
                .then(({body: {articles}})=> {
                    expect(articles.length).toBe(3);
                })
            })
            test('total_count property: displaying the total number of articles(should display the total number of articles with any filters applied, discounting the limit)', () => {
                return request(app)
                .get('/api/articles')
                .then(({body: {total_count, articles}})=> {
                    expect(total_count).toBe(13)
                    expect(articles.length).toBe(10);
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
        describe('Added feature: GET `/api/articles/:article_id/comments` tests', () => {
            test('limit query: limits the number of responses',() => {
                return request(app)
                .get('/api/articles/1/comments?limit=5')
                .then(({body: {comments}}) => {
                    expect(comments.length).toBe(5)
                })
            })
            test('limit query: limits the number of responses(defaults to 10)',() => {
                return request(app)
                .get('/api/articles/1/comments')
                .then(({body: {comments}}) => {
                    expect(comments.length).toBe(10)
                })
            })
            test('p query: page query, specifies the page at which to start(calculated using limit) , testing page 1',() => {
                return request(app)
                .get('/api/articles/1/comments?limit=5&p=1')
                .then(({body: {comments}}) => {
                    expect(comments.length).toBe(5)
                })
            })
            test('p query: page query, specifies the page at which to start(calculated using limit) , testing page 2',() => {
                return request(app)
                .get('/api/articles/1/comments?limit=5&p=2')
                .then(({body: {comments}}) => {
                    expect(comments.length).toBe(5)
                })
            })
            test('p query: page query, specifies the page at which to start(calculated using limit) , testing page 3',() => {
                return request(app)
                .get('/api/articles/1/comments?limit=5&p=3')
                .then(({body: {comments}}) => {
                    expect(comments.length).toBe(1)
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
        test('200: returns status code 200 when sent with a valid and existing article id even if the body send have multiple properties(which will be ignored) as long as it contains the required property(inc_votes)', () => {
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
    describe('GET `/api/users/:username` tests',() => {
        test('200: returns status code 200 upon successful request',()=> {
            return request(app)
            .get('/api/users/butter_bridge')
            .expect(200);
        })
        test('200: returns a user object which should have certain properties',()=> {
            const expectedObject = {
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            };
    
            return request(app)
            .get('/api/users/butter_bridge')
            .then(({body: {user}}) => {
                expect(user).toEqual(expectedObject);
            })
        })
    })
    describe('PATCH `/api/comments/:comment_id` tests', () => {
        test(`200: returns a status code of 200 upon successful request.`, () => {
            return request(app)
            .patch(`/api/comments/1`)
            .send({inc_votes: 10})
            .expect(200);
        })
        test(`200: returns the updated comment(increment)`, () => {
            const expectedObject = {
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                votes: 26,
                author: "butter_bridge",
                article_id: 9,
                created_at: "2020-04-06T12:17:00.000Z",
            };

            return request(app)
            .patch(`/api/comments/1`)
            .send({inc_votes: 10})
            .then(({body:{updatedComment}}) => {
                expect(updatedComment).toEqual(expectedObject);
            })
        })
    })
    describe('POST `/api/articles` tests',() => {
        test('201: returns status code upon successful post request', ()=> {
            return request(app)
            .post('/api/articles')
            .send({
                author: 'butter_bridge',
                title: 'test1',
                body: 'test2',
                topic: 'mitch',
                article_img_url: 'test3',
                comment_count: 0
            })
            .expect(201);
        })
        test('201: returns the newly posted article', ()=> {
            const expectedObject = {
                article_id: 14,
                author: 'butter_bridge',
                title: 'test1',
                body: 'test2',
                topic: 'mitch',
                created_at: expect.any(String),
                votes: 0,
                article_img_url: 'test3',
                comment_count: 0
            }

            return request(app)
            .post('/api/articles')
            .send({
                author: 'butter_bridge',
                title: 'test1',
                body: 'test2',
                topic: 'mitch',
                article_img_url: 'test3',
                comment_count: 0
            })
            .then(({body: {postedArticle}}) => {
                expect(postedArticle).toEqual(expectedObject)
            });
        })
        test('201: returns the newly posted article and will provide a default article_img_url if not provided during request.', ()=> {
            const expectedObject = {
                article_id: 14,
                author: 'butter_bridge',
                title: 'test1',
                body: 'test2',
                topic: 'mitch',
                created_at: expect.any(String),
                votes: 0,
                article_img_url: 'Please provide image url',
                comment_count: 0
            }

            return request(app)
            .post('/api/articles')
            .send({
                author: 'butter_bridge',
                title: 'test1',
                body: 'test2',
                topic: 'mitch'
            })
            .then(({body: {postedArticle}}) => {
                expect(postedArticle).toEqual(expectedObject)
            });
        })
        test('201: returns the newly posted article and will ignore other properties the request body have that is not needed.', ()=> {
            const expectedObject = {
                article_id: 14,
                author: 'butter_bridge',
                title: 'test1',
                body: 'test2',
                topic: 'mitch',
                created_at: expect.any(String),
                votes: 0,
                article_img_url: 'Please provide image url',
                comment_count: 0
            }

            return request(app)
            .post('/api/articles')
            .send({
                author: 'butter_bridge',
                title: 'test1',
                body: 'test2',
                topic: 'mitch',
                test: 'test',
                test1: 'test1'
            })
            .then(({body: {postedArticle}}) => {
                expect(postedArticle).toEqual(expectedObject)
            });
        })
        test('201: returns the newly posted article even if the topic of the requested body does not exist in the database and will add the new topic to the database', ()=> {
            const expectedObject = {
                article_id: 14,
                author: 'butter_bridge',
                title: 'test1',
                body: 'test2',
                topic: 'testTopic',
                created_at: expect.any(String),
                votes: 0,
                article_img_url: 'Please provide image url',
                comment_count: 0
            }

            return request(app)
            .post('/api/articles')
            .send({
                author: 'butter_bridge',
                title: 'test1',
                body: 'test2',
                topic: 'testTopic',
            })
            .then(({body: {postedArticle}}) => {
                expect(postedArticle).toEqual(expectedObject)
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
            test('400: returns status code 400 when sent with an invalid limit value', () => {
                return request(app)
                .get('/api/articles/1/comments?limit=test')
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Bad Request')
                })
            })
            test('400: returns status code 400 when sent with an invalid p value', () => {
                return request(app)
                .get('/api/articles/1/comments?p=test')
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Bad Request')
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
        describe('GET `/api/articles`',() => {
            describe('Features error handling',() => {
                test('404 topic query: returns status code 404 when requested with a non-existing topic value',() => {
                    return request(app)
                    .get('/api/articles?topic=1234')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe('Not Found')
                    })
                })
                test('404 sort_by query: returns status code 404 when requested with a non existing column to sort by', () => {
                    return request(app)
                    .get('/api/articles?sort_by=1234')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe('Not Found')
                    })
                })
                test('400 order query: returns status code 400 when requested with order value of neither asc or desc', () => {
                    return request(app)
                    .get('/api/articles?sort_by=article_id&order=test')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe('Bad Request')
                    })
                })
                test('404 topic query: returns status code 404 if the request has no articles on an existing topic', () => {
                    return request(app)
                    .get('/api/articles?topic=paper')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe('Not Found')
                    })
                })
                test('400 limit query: returns status code 400 if the request has an invalid limit value', () => {
                    return request(app)
                    .get('/api/articles?limit=test')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe('Bad Request')
                    })
                })
                test('400 limit query: returns status code 400 if the request has an invalid limit value', () => {
                    return request(app)
                    .get('/api/articles?limit=-1')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe('Bad Request')
                    })
                })
                test('400 p query: returns status code 400 if the request has an invalid limit value', () => {
                    return request(app)
                    .get('/api/articles?p=test')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe('Bad Request')
                    })
                })
                test('400 p query: returns status code 400 if the request has an invalid limit value', () => {
                    return request(app)
                    .get('/api/articles?p=-1')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe('Bad Request')
                    })
                })
                test('404 p query: returns status code 404 if the request has a valid limit value but non-existed pages', () => {
                    return request(app)
                    .get('/api/articles?p=999')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe('Not Found')
                    })
                })
            })
        })
        describe('GET `/api/users/:username` errors',() => {
            test('400: returns status code 400 when sent with an invalid request.',() => {
                return request(app)
                .get('/api/users/1234')
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).toBe('Not Found')
                })
            })
        })
    })
    describe('PATCH `/api/comments/:comment_id` errors', () => {
        test(`400: returns status code 400 when sent with an invalid comment id`, () => {
            return request(app)
            .patch(`/api/comments/test`)
            .send({inc_votes: 10})
            .expect(400)
            .then(({body:{msg}}) => {
                expect(msg).toEqual(`Bad Request`);
            })
        })
        test(`400: returns status code 400 when sent with an invalid request body`, () => {
            return request(app)
            .patch(`/api/comments/1`)
            .send({test: 10})
            .expect(400)
            .then(({body:{msg}}) => {
                expect(msg).toEqual(`Bad Request`);
            })
        })
        test(`404: returns status code 404 when sent with a valid body and comment_id but non existing comment id`, () => {
            return request(app)
            .patch(`/api/comments/999`)
            .send({inc_votes: 10})
            .expect(404)
            .then(({body:{msg}}) => {
                expect(msg).toEqual(`Not Found`);
            })
        })
    })
    describe('POST `/api/articles` errors',() => {
        test('400: returns status code 400 when sent with an invalid request body', () => {
            return request(app)
            .post('/api/articles')
            .send({test: 'test'})
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Bad Request')
            });
        })
        test('400: returns status code 400 when sent with a request body that lacks necessary properties', () => {
            return request(app)
            .post('/api/articles')
            .send({
                title: 'test1',
                body: 'test2',
                topic: 'mitch',
                article_img_url: 'test3'
            })
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe('Bad Request')
            });
        })
    })
})