import supertest from 'supertest';
import app from '../../server';
import { User } from '../../models/user';
import jwt, { Secret } from 'jsonwebtoken';
const request = supertest(app);

describe('dashboard handler', () => {

  const user: User = {
    firstname: 'John',
    lastname: "Wick",
    password: "password123"
  }

  type Decoded_Token = {
    user: User,
    iat: number
  }
  let token: string;
  let user_data: User;

  beforeAll(async () => {
    token = (
      await request
        .post('/users')
        .send(user)
        .expect(201)
    ).body;
    user_data = (jwt.verify(
      token,
      process.env.TOKEN_SECRET as Secret
    ) as Decoded_Token).user
  })

  afterAll(async () => {
    await request
      .delete(`/users/${user_data.id}`)
      .set({ 'Authorization': 'Bearer ' + token })
      .expect(200)
  })

  describe('products functions', () => {
    it('should show top 5 popular products', async () => {
      const response = await request
        .get('/dashboard/popular_products')
        .set({ 'Authorization': 'Bearer ' + token })
        .expect(200)
      expect(response.body).toEqual([])
    })
    it('should show products of specific category',async () => {
      const response = await request
        .get('/dashboard/product_by_category?category=electronics')
        .set({ 'Authorization': 'Bearer ' + token })
        .expect(200)
      expect(response.body).toEqual([])
    })
  })
})