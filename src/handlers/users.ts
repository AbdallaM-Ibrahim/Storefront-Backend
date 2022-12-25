import express, { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { authToken } from '../middlewares/auth'
import { Order } from '../models/order'
import { User, Store as UsersDB } from '../models/user'
import { DashboardQueries } from '../services/dashboard'

const usersDB = new UsersDB()
const dashboard = new DashboardQueries()


const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users: User[] = await usersDB.index()
    res.json(users)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id
    const user: User = await usersDB.show(id)
    res.json(user)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }

    const newUser: User = await usersDB.create(user)
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as Secret)
    res.status(201).json(token)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id
    const deleted: User = await usersDB.delete(id)
    res.json(deleted)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const currentOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id
    const order: Order = await dashboard.currentOrderByUser(id)
    res.json(order)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const completedOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id
    const orders: Order[] = await dashboard.compOrdersByUser(id)
    res.json(orders)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const userRoutes = (app: express.Application): void => {
  app.get('/users', authToken, index)
  app.get('/users/:id', authToken, show)
  app.post('/users', create)
  app.delete('/users/:id', authToken, destroy)
  app.get('/users/:id/current', authToken, currentOrder)
  app.get('/users/:id/completed', authToken, completedOrders)
}

export default userRoutes