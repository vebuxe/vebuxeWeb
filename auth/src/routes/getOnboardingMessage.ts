import express, { Request, Response } from 'express';
import { currentUser, validateRequest, NotFoundError } from '@vboxdev/common';
import { body } from 'express-validator';
import { Message } from '../models/message';

const router = express.Router();

router.get(
  '/api/users/onboarding/message',
  async (req: Request, res: Response) => {

    const message = await Message.find({});

    if (!message) {
      throw new NotFoundError();
    }

    res.status(200).send(message);
  }
);

export { router as GetUserOnBoardingMessageRouter };
