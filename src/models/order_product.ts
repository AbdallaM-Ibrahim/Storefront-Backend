import Client from '../database'

export type Order_Product = {
  order_id: string;
  product_id: string;
  quantity: number;
}

export class Store {
  async index(): Promise<Order_Product[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM order_products'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get order_products. Error: ${err}`)
    }
  }

  async show(order_id: string, product_id: string): Promise<Order_Product> {
    try {
      const sql = 'SELECT * FROM order_products WHERE order_id=($1) AND product_id=($2)'
      const conn = await Client.connect()

      const result = await conn.query(sql, [order_id, product_id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${product_id} inside order ${order_id}. Error: ${err}`)
    }
  }

  async create(op: Order_Product): Promise<Order_Product> {
    try {
      const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *'
      const conn = await Client.connect()
      const result = await conn
        .query(sql, [op.order_id, op.product_id, op.quantity])

      const order_product: Order_Product = result.rows[0]

      conn.release()

      return order_product
    } catch (err) {
      throw new Error(`Could not add product ${op.product_id} to order ${op.order_id}. Error: ${err}`)
    }
  }

  async delete(order_id: string, product_id:string): Promise<Order_Product> {
    try {
      const sql = 'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *'
      const conn = await Client.connect()

      const result = await conn.query(sql, [order_id, product_id])

      const order_product: Order_Product = result.rows[0]

      conn.release()

      return order_product
    } catch (err) {
      throw new Error(`Could not delete order_product ${product_id} from order ${order_id}. Error: ${err}`)
    }
  }

  async getByOrder(order_id: string): Promise<Order_Product[]> {
    try {
      const sql = 'SELECT * FROM order_products WHERE order_id=($1)'
      const conn = await Client.connect()

      const result = await conn.query(sql, [order_id])

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not find products inside order ${order_id}. Error: ${err}`)
    }
  }
}