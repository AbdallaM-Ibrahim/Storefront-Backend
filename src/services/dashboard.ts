import Client from '../database'
import { Order, Status } from '../models/order';
import { Product } from '../models/product';

export class DashboardQueries {
  //? ToDo: Optional
  async mostPopularProducts(): Promise<Product[]> {
    try {
      const sql = 'SELECT p.*, SUM(op.quantity) FROM products AS p JOIN order_products AS op ON p.id=op.product_id GROUP BY op.product_id,p.id ORDER BY SUM(op.quantity) DESC LIMIT 5;';
      const conn = await Client.connect()

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`)
    }
  }
  
  //? ToDo: Optional
  async productsByCategory(category: string): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products WHERE category=($1)'
      const conn = await Client.connect()

      const result = await conn.query(sql, [category])

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get products with category ${category}. Error: ${err}`)
    }
  }

  // ToDo: Mandatory
  async currentOrderByUser(user_id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)'
      const conn = await Client.connect()

      const result = await conn.query(sql, [user_id, Status.active])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get current order for user ${user_id}. Error: ${err}`)
    }
  }

  //? ToDo: Optional
  async compOrdersByUser(user_id: string): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)'
      const conn = await Client.connect()

      const result = await conn.query(sql, [user_id, Status.complete])

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get completed orders for user ${user_id}. Error: ${err}`)
    }
  }
}