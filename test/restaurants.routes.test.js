// tests/restaurants.routes.test.js
const request = require('supertest');
const createApp = require('../src/app');
const restaurantService = require('../src/services/restaurants.service');

describe('Restaurant routes', () => {
  let app;

  beforeEach(() => {
    restaurantService.resetStore();
    app = createApp();
  });

  test('GET /api/restaurants returns a list', async () => {
    const response = await request(app).get('/api/restaurants');
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('GET /api/restaurants/sync-demo flags synchronous execution', async () => {
    const response = await request(app).get('/api/restaurants/sync-demo');
    expect(response.status).toBe(200);
    expect(response.body.meta.execution).toBe('synchronous');
  });

  test('GET /api/restaurants/:id returns an item', async () => {
    const response = await request(app).get('/api/restaurants/1');
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(1);
  });

  test('GET /api/restaurants/:id handles missing items', async () => {
    const response = await request(app).get('/api/restaurants/999');
    expect(response.status).toBe(404);
    expect(response.body.error.message).toContain('not found');
  });

  test('POST /api/restaurants validates payload', async () => {
    const response = await request(app)
      .post('/api/restaurants')
      .send({ name: '테스트' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain('category');
  });

  test('POST /api/restaurants creates a restaurant', async () => {
    const payload = {
      name: '새로운 식당',
      category: '카페',
      location: '캠퍼스 타운',
    };

    const response = await request(app)
      .post('/api/restaurants')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(payload.name);
  });
});