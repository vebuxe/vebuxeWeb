import express, { Request, Response } from 'express';

import { BadRequestError, NotAuthorizedError } from '@vboxdev/common';
import { Code } from '../models/code';
import { VerificationStatus } from '../services/verification-status';
import { body } from 'express-validator';
import { CodeUpdatedPublisher } from '../events/publisher/code-updated-publisher';
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

    const user = await Code.findOne({
      $and: [
        { masked_phone: telephone },
        { verification: VerificationStatus.Unverified },
        { verification_code: code },
      ],
    });

    if (!user) {
      throw new BadRequestError('Wrong Verification code.');
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

    new CodeUpdatedPublisher(natsWrapper.client).publish({
      user: user.id,
      expiresAt: user.expiresAt,
      masked_phone: user.masked_phone,
      verification_code: user.verification_code,
      version: user.version,
      codeType: user.codeType,
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
