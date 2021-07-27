import express, { Request, Response } from 'express';
import { currentUser, validateRequest,requireAuth, requireAuthAdmin } from '@vboxdev/common';
import { body } from 'express-validator';
import { Message } from '../models/message';

const router = express.Router();

router.post(
  '/api/users/onboarding/message',
  [
    body('title').not().isEmpty().withMessage('title is required'),
    body('description').not().isEmpty().withMessage('description is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, description } = req.body;

    const message = Message.build({
      title,
      description,
    });

    await message.save();

    res.status(201).send(message);


  }
);

export { router as UserOnBoardingMessageRouter };
