import express, { Request, Response } from 'express';
import { currentUser,  requireAuth,
  validateRequest,
  requireAuthAdmin, } from '@vboxdev/common';
import { body } from 'express-validator';
import { Category } from '../models/category';

const router = express.Router();

router.post(
  '/api/movies/category',
  requireAuth,
  requireAuthAdmin,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('description').not().isEmpty().withMessage('description is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    
    const { title, description } = req.body;

    const category = Category.build({
      title,
      description,
    });

    await category.save();

  

    res.status(201).send(category);
  }
);

export { router as CategoryRouter };
