import express, { Request, Response } from 'express';

import { BadRequestError, NotAuthorizedError } from '@vboxdev/common';
import { User } from '../models/user';
import { VerificationStatus } from '../services/verification-status';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/users/email-verification/:userId',
  body('code').notEmpty().matches(/^\d+$/).withMessage('Invalid code number'),

  async (req: Request, res: Response) => {
    const { code } = req.body;

    const userId = req.params.userId;

    const user = await User.findById(req.params.userId);

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
    await user.save();

    res.send(user);

    // store it on session object
  }
);

export { router as EmailVerificationRouter };
