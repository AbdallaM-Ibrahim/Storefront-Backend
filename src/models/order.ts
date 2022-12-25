import Client from '../database'

export enum Status {
  active = 'active',
  complete = 'complete',
}

export type Order = {
  id?: number;
  user_id: string;
  status: Status;
}

export class Store {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM orders'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`)
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)'
      const conn = await Client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`)
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *'
      const conn = await Client.connect()
      const result = await conn
        .query(sql, [o.user_id, o.status])

      const order: Order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(`Could not add new order for ${o.user_id}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) returning *'
      const conn = await Client.connect()

      const result = await conn.query(sql, [id])

      const order: Order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`)
    }
  }
}