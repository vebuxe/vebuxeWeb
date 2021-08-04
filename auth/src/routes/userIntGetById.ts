import express, { Request, Response } from 'express';
import {
  currentUser,
  NotFoundError,
  NotAuthorizedError,
} from '@vboxdev/common';
import { UserInt } from '../models/userInt';

const router = express.Router();

router.get(
  '/api/users/int/list/:userId',
  currentUser,
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await UserInt.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

  

    res.send(user);
  }
);

export { router as UserIntGetByIdRouter };
