const request = require('supertest');
const app = require('../src/app');

describe('HU14 - Detalle de producto', () => {
  test('GET /posts/10 debe devolver el detalle del producto', async () => {
    const response = await request(app).get('/posts/10');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Detalle de producto obtenido correctamente');
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(10);
    expect(response.body.data.title).toBe('Producto de prueba');
    expect(response.body.data.price).toBe(150);
    expect(Array.isArray(response.body.data.images)).toBe(true);
  });
});