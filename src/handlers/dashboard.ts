import express, { Request, Response } from 'express'
import { Product } from '../models/product'
import { DashboardQueries } from '../services/dashboard'

const dashboard = new DashboardQueries()

const popularProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products: Product[] = await dashboard.mostPopularProducts()
    res.json(products)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const productWithCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const products: Product[] = await dashboard.productsByCategory(req.query.category as string)
    res.json(products)
  } catch (err: unknown) {
    res.status(400)
    if(err instanceof Error)
    res.json(err?.message)
  }
}

const dashboardRoutes = (app: express.Application): void => {
  app.get('/dashboard/popular_products', popularProducts)
  app.get('/dashboard/product_by_category', productWithCategory)
}

export default dashboardRoutes