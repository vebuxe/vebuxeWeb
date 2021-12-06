import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@vboxdev/common';
import { IndexrRouter } from './routes/index';
import { CreateNewRouter } from './routes/new';
import { CategoryRouter } from './routes/category';
import { CategoryListRouter } from './routes/category_list';
import { CategoryShowRouter } from './routes/category_show';
import { CategoryDeleteRouter } from './routes/category_remove';
import { CategoryUpdateRouter } from './routes/category_update';
var fileupload = require('express-fileupload');


import cookieSession from 'cookie-session';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(fileupload());

app.use(
  fileupload({
    limits: { fileSize: 500 * 1024 * 1024 },
  })
);

app.use(currentUser);

app.use(IndexrRouter);
app.use(CreateNewRouter);
app.use(CategoryRouter);
app.use(CategoryListRouter);
app.use(CategoryShowRouter);
app.use(CategoryDeleteRouter);
app.use(CategoryUpdateRouter);


app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
