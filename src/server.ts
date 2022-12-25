import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users'
import orderRoutes from './handlers/orders'
import productRoutes from './handlers/products'
import dashboardRoutes from './handlers/dashboard';

const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(bodyParser.json());

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    req.method,
    req.url,
    'Token:' + Boolean(req.headers.authorization),
    'body:' + JSON.stringify(req.body),
  )
  next()
}
// app.use(logger)

app.get('/', function (req: Request, res: Response): void {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

userRoutes(app);
orderRoutes(app);
productRoutes(app);
dashboardRoutes(app);

export default app;