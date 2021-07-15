import express, { Request, Response } from 'express';
import {
  currentUser,
  NotFoundError,
  NotAuthorizedError,
} from '@vboxdev/common';
import { User } from '../models/user';

const router = express.Router();

router.get(
  '/api/users/:userId',
  currentUser,
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    if (user.id != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(user);
  }
);

export { router as UserRouter };
