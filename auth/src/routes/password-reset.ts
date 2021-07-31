import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  BadRequestError,
  validateRequest,
  VerificationStatus,
  CodeType,
} from '@vboxdev/common';
import { User } from '../models/user';
import { Code } from '../models/code';
import { body } from 'express-validator';
import { UserUpdatedPublisher } from '../events/publisher/user-updated-publisher ';
import { CodeUpdatedPublisher } from '../events/publisher/code-updated-publisher';

import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/users/password-reset/',
  [
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
    body('rpassword')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
    body('code').notEmpty().matches(/^\d+$/).withMessage('Invalid code number'),
    body('telephone')
      .trim()
      .notEmpty()
      .withMessage('Telephone cannot be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { password, rpassword, code, telephone } = req.body;

    if (rpassword !== password) {
      throw new BadRequestError('Password do not match');
    }

    const userCode = await Code.findOne({
      $and: [
        { masked_phone: telephone },
        { verification: VerificationStatus.Unverified },
        { verification_code: code },
      ],
    });

    if (!userCode) {
      throw new BadRequestError('Wrong Verification code.');
    }

    const user = await User.findById(userCode.user);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    if (code && userCode.verification_code != code) {
      throw new BadRequestError('Invalid verification code.');
    }

    user.set({
      password: password,
    });

    userCode.set({
      verification: VerificationStatus.Verified,
      codeType: CodeType.Passowrd,
    });

    await user.save();

    await userCode.save();

    new UserUpdatedPublisher(natsWrapper.client).publish({
      id: user.id,
      email: user.email,
      username: user.username,
      userType: user.userType!,
      telephone: parseInt(user.telephone),
      status: user.status!,
      version: user.version,
    });

    new CodeUpdatedPublisher(natsWrapper.client).publish({
      user: userCode.id,
      expiresAt: userCode.expiresAt,
      masked_phone: userCode.masked_phone,
      verification_code: userCode.verification_code,
      version: userCode.version,
      codeType: userCode.codeType,
      verification: userCode.verification,
    });

    res.status(201).send({
      successful: true,
    });
  }
);

export { router as PasswordResetRouter };
