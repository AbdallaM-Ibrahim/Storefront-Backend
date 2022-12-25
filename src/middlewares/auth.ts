import { Request, Response, NextFunction } from "express"
import jwt, { Secret } from 'jsonwebtoken'


export const authToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token: string | undefined = authHeader?.split(' ')[1]
    if (!token) throw new Error();
    jwt.verify(token, process.env.TOKEN_SECRET as Secret)
    next()
  } catch (err) {
    res.status(401)
    res.json('Access denied, invalid token')
    return
  }
}

