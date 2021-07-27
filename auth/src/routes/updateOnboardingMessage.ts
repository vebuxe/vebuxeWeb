import express, { Response, Request } from 'express';
import { Message } from '../models/message';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import {
  NotFoundError,
  requireAuth,
  currentUser,
  NotAuthorizedError,
} from '@vboxdev/common';
import { UserUpdatedPublisher } from '../events/publisher/user-updated-publisher ';
const router = express.Router();

router.put(
  '/api/users/onboarding/message/:messageId',

  async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const messageId = req.params.messageId;
    const message = await Message.findById(messageId);

    if (!message) {
      throw new NotFoundError();
    }

    if (title) {
      message.set({ title });
    }

    if (description) {
      message.set({ description });
    }

    await message.save();

    res.status(200).send(message);
  }
);

export { router as OnboardingUpdateRouter };
