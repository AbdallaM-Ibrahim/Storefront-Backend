import supertest from 'supertest';
import { Product } from '../../models/product';
import app from '../../server';
import { User } from '../../models/user';
import jwt, { Secret } from 'jsonwebtoken';
const request = supertest(app);

describe('products handler', () => {
  const product: Product = {
    name: 'John',
    price: 1050,
    category: "perfume"
  }
  const user: User = {
    firstname: 'John',
    lastname: "Wick",
    password: "password123"
  }

  let product_data: Product;

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

  it("should create product", async () => {
    const response = await request
      .post('/products')
      .set({ 'Authorization': 'Bearer ' + token })
      .send(product)
      .expect(201);
    product_data = response.body;
    expect(product_data.id).not.toEqual(undefined)
  })

  it("should get all products", async () => {
    const response = await request
      .get('/products')
      .set({ 'Authorization': 'Bearer ' + token })
      .expect(200)
    expect(response.body).toEqual([product_data])
  })

  it("should get one product", async () => {
    const response = await request
      .get(`/products/${product_data.id}`)
      .set({ 'Authorization': 'Bearer ' + token })
      .expect(200)
    expect(response.body).toEqual(product_data)
  })

  it("should get delete product", async () => {
    await request
      .delete(`/products/${product_data.id}`)
      .set({ 'Authorization': 'Bearer ' + token })
      .expect(200)
    const products_in_db = (await request
      .get('/products')
      .set({ 'Authorization': 'Bearer ' + token })
      .expect(200)).body
    expect(products_in_db).toEqual([])
  })


})