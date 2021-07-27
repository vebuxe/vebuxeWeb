import express, { Request, Response } from 'express';
import { NotFoundError, BadRequestError } from '@vboxdev/common';
import { Movies } from '../models/movies';
import { User } from '../models/users';
import { Category } from '../models/category';

const router = express.Router();

router.post('/api/movies/upload', async (req: Request, res: Response) => {
  console.log(req.files);
  

  res.json(req.files);
  

});

export { router as IndexrRouter };
