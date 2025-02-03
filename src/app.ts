import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { productRoutes } from './modules/product';
import { userRoutes } from './modules/user';
import { orderRoutes } from './modules/order';
import { swaggerSpec, swaggerUi } from './config/swagger';

dotenv.config();

export const app = express();

const isDevelopment = process.env.NODE_ENV === 'development';

// Parsing data
app.use(
  express.json({
    limit: '15kb'
  })
);
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan(isDevelopment ? 'dev' : 'common'));

// Importants stufs
app.use(helmet());
app.use(cors());
app.use(
  compression({
    filter: (request: Request, response: Response) => {
      if (request.headers['x-no-compression']) return false;
      return compression.filter(request, response);
    }
  })
);

// Limiter (for overload)
app.use(
  rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Demaciadas consultas, espera 1 hora!',
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
