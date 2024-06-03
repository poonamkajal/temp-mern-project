import 'express-async-errors';
import * as dotenv from'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';


//router
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

//public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

//middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

// try {
//     const response = await fetch(
//       'https://www.course-api.com/react-useReducer-cart-project'
//     );
//     const cartData = await response.json();
//     console.log(cartData);
//   } catch (error) {
//     console.log(error);
//   }

// fetch(
//     'https://www.course-api.com/react-useReducer-cart-project'
//   ).then((res) => res.json())
//   .then((data) => console.log(data));
const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static(path.resolve(__dirname, './public')));

// app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.json());

app.get('/api/v1/test', (req, res) => {
    res.json({ msg: 'test route' });
  });

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post(
    '/api/v1/test',
    [body('name').notEmpty().withMessage('name is required')],
    
    (req, res) => {
      const { name } = req.body;
      res.json({ msg: `hello ${name}` });
    }
);
  

app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});

app.use('*', (req, res) => {
    res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server running on PORT ${port}....`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

// app.listen(port, () => {
//   console.log(`server running on PORT ${port}....`);
// });



// app.listen(5100, () => {
//   console.log('server running....');
// });