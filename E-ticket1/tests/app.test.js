import request from 'supertest';
import app from '../src/app.js';

describe('Express Application Structure', () => {
  describe('Health Check Endpoint', () => {
    it('should return 200 and success message', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/undefined-route')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Cannot GET /undefined-route');
    });

    it('should return 404 for POST to undefined routes', async () => {
      const response = await request(app)
        .post('/undefined-route')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body.message).toContain('Cannot POST /undefined-route');
    });
  });

  describe('Middleware Configuration', () => {
    it('should parse JSON request bodies', async () => {
      // This will be tested more thoroughly when we add actual routes
      // For now, we verify the app accepts JSON
      const response = await request(app)
        .post('/health')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json')
        .expect(404); // 404 because POST /health doesn't exist

      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should handle CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Error Handler', () => {
    it('should return consistent error format', async () => {
      const response = await request(app)
        .get('/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message');
    });
  });
});
