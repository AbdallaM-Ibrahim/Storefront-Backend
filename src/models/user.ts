import Client from '../database'
import bcrypt from 'bcrypt'

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password: string;
}

export class Store {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM users'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`)
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const conn = await Client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`)
    }
  }

  async create(u: User): Promise<User> {
    try {
      const sql = 'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *'
      const { PEPPER, SALT_ROUNDS } = process.env
      const hash: string = bcrypt.hashSync(
        u.password + PEPPER,
        parseInt(SALT_ROUNDS || '10')
      )
      const conn = await Client.connect()
      const result = await conn
        .query(sql, [u.firstname, u.lastname, hash])

      const user = result.rows[0]

      conn.release()

      return user
    } catch (err) {
      throw new Error(`Could not add new user ${u.firstname}. Error: ${err}`)
    }
  }

  async authenticate(id: number, password: string): Promise<User | null> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT password FROM users WHERE id=($1) RETURNING *'
      const result = await conn
        .query(sql, [id])
      conn.release()

        if(result.rows.length) {
          const { PEPPER } = process.env
          const user = result.rows[0]
          if (bcrypt.compareSync(password + PEPPER, user.password)) {
            return user
          }
        }
      return null
    } catch (err) {
      throw new Error(`Failed authenticating user ${id}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *'
      const conn = await Client.connect()

      const result = await conn.query(sql, [id])

      const user: User = result.rows[0]

      conn.release()

      return user
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`)
    }
  }
}