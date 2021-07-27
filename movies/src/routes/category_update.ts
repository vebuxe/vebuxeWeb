import express, { Request, Response } from 'express';
import { NotFoundError } from '@vboxdev/common';
import { Category } from '../models/category';

const router = express.Router();

router.put(
  '/api/movies/category/:catId',
  async (req: Request, res: Response) => {

     const { title, description} =
       req.body;



    const category = await Category.findById(req.params.catId);

    if (!category) {
      throw new NotFoundError();
    }


     if (title) {
       category.set({ title });
     }

     if (description) {
       category.set({ description });
     }

    await category.save();

    res.status(201).send(category);
  }
);

export { router as CategoryUpdateRouter };
