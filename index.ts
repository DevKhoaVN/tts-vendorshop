// server.ts
import 'dotenv/config'; // thay require("dotenv").config();
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import './database/init.db'; 
import routes from './routes'; 

const app = express(); 
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());




app.use('/', routes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    res.status(status).json({
        status: 'error',
        code: status,
        message: error.message || 'Internal Server Error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
