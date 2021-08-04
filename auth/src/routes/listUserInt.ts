import express, { Request, Response } from 'express';
import { currentUser, NotFoundError } from '@vboxdev/common';
import { UserInt } from '../models/userInt';

const router = express.Router();

router.get(
  '/api/users/int/list',

  async (req: Request, res: Response) => {
    const user = await UserInt.find();

    if (!user) {
      throw new NotFoundError();
    }

    res.send(user);
  }
);

export { router as ListUserIntRouter };
