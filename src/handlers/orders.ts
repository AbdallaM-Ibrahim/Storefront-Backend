import express, { Request, Response } from 'express'
import { Order, Status, Store as OrdersDB } from '../models/order'
import { Order_Product, Store as OP_DB } from '../models/order_product'
import { authToken } from '../middlewares/auth'

const ordersDB = new OrdersDB()
const op_DB = new OP_DB()


const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders: Order[] = await ordersDB.index()
    res.json(orders)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id
    const order: Order = await ordersDB.show(id)
    res.json(order)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const order: Order = {
      user_id: req.body.user_id,
      status: req.body.status as Status
    }

    const newOrder: Order = await ordersDB.create(order)
    res.status(201).json(newOrder)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id
    const deleted: Order = await ordersDB.delete(id)
    res.json(deleted)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const getOrderProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id: string = req.params.order_id

    const thisOrderProducts: Order_Product[] = await op_DB.getByOrder(order_id)
    res.json(thisOrderProducts)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_product: Order_Product = {
      order_id: req.params.order_id,
      product_id: req.body.product_id,
      quantity: req.body.quantity
    }

    const newOP: Order_Product = await op_DB.create(order_product)
    res.status(201).json(newOP)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const removeProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const op: Order_Product = await op_DB.delete(
      req.params.order_id,
      req.params.product_id,
    )
    res.json(op)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const orderRoutes = (app: express.Application): void => {
  app.use('/orders', authToken)
  app.get('/orders', index)
  app.get('/orders/:id', show)
  app.post('/orders', create)
  app.delete('/orders/:id', destroy)
  app.get('/orders/:order_id/products', getOrderProducts)
  app.post('/orders/:order_id/products', addProduct)
  app.delete('/orders/:order_id/products/:product_id', removeProduct)
}

export default orderRoutes;