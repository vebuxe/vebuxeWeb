import express, { Request, Response } from 'express';

import { BadRequestError, NotAuthorizedError } from '@vboxdev/common';
import { User } from '../models/user';
import { VerificationStatus } from '../services/verification-status';
import { body } from 'express-validator';
import { UserUpdatedPublisher } from '../events/publisher/user-updated-publisher ';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/users/verification/code',
  body('code').notEmpty().matches(/^\d+$/).withMessage('Invalid code number'),
  body('telephone')
    .notEmpty()
    .matches(/^\d+$/)
    .withMessage('Invalid telephone number'),

  async (req: Request, res: Response) => {
    const { code, telephone } = req.body;

    const user = await User.findOne({ telephone });

    if (!user) {
      throw new NotAuthorizedError();
    }

    if (user.verification === VerificationStatus.Verified) {
      throw new BadRequestError('User is already verified');
    }

    if (user.verification === VerificationStatus.Expire) {
      throw new BadRequestError('Verification link already expired');
    }

    if (code && user.verification_code != code) {
      throw new BadRequestError('Invalid verification code.');
    }

    user.verification = VerificationStatus.Verified;
    user.verification_code = 0;
    await user.save();

    new UserUpdatedPublisher(natsWrapper.client).publish({
      id: user.id,
      email: user.email,
      username: user.username,
      userType: user.userType!,
      telephone: parseInt(user.telephone),
      expiresAt: user.expiresAt,
      status: user.status!,
      version: user.version,
      verification: user.verification,
    });

    res.status(201).send({
      successful: true,
      code: 200,
      message: 'Phone Verified',
    });

    // store it on session object
  }
);

export { router as EmailVerificationRouter };
