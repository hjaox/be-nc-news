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
    describe('Error handling tests', () => {
    })
})