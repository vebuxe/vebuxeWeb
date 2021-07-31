import express, { Request, Response } from 'express';
import {
  currentUser,
  NotFoundError,
  NotAuthorizedError,
} from '@vboxdev/common';
import { Code } from '../models/code';

const router = express.Router();

router.get(
  '/api/users/code/get',

  async (req: Request, res: Response) => {
    const user = await Code.find({});

    if (!user) {
      throw new NotFoundError();
    }

    res.send(user);
    
  }
);

export { router as UserCodeRouter };
