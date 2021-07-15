import express, { Request, Response } from 'express';
import { NotFoundError } from '@vboxdev/common';
import { User } from '../models/users';

const router = express.Router();

router.get('/api/movies/', async(req: Request, res: Response) => {
 
  const user = await User.find({});

  if (!user) {
    throw new NotFoundError();
  }

  res.send(user);
});

export { router as IndexrRouter };
