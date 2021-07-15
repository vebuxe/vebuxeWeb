import express, { Request, Response } from 'express';
import { NotFoundError } from '@vboxdev/common';
import { Category } from '../models/category';

const router = express.Router();

router.get('/api/movies/category/:catId', async (req: Request, res: Response) => {


  const category = await Category.findById(req.params.catId);

  if (!category) {
    throw new NotFoundError();
  }

  res.send(category);
});

export { router as CategoryShowRouter };
