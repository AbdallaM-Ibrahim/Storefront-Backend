import supertest from 'supertest';
import app from '../server';

const request = supertest(app);
describe('Server', () => {
  it('should have status 200', async (): Promise<void> => {
    await request.get('/').expect(200);
  });
})