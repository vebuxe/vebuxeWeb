import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { Code } from '../models/code';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import {
  validateRequest,
  BadRequestError,
  VerificationStatus,
} from '@vboxdev/common';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('username').notEmpty().withMessage('You must supply a username'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: username }, { telephone: username }],
    });

    if (!existingUser) {
      throw new BadRequestError('Invalid login details');
    }

    const passwordsMAtch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMAtch) {
      throw new BadRequestError('Invalid login details');
    }

    const userCode = await Code.findOne({ user: existingUser.id });

    if (!userCode) {
      throw new BadRequestError(
        'This account has not initiated the verification process.'
      );
    }

    if (userCode.verification === VerificationStatus.Unverified) {
      throw new BadRequestError(
        'Your account is unverified. Kindly check your mail to verify.'
      );
    }

    if (userCode.verification === VerificationStatus.Expire) {
      throw new BadRequestError(
        'Your account verification has expired. kindli initaite another verification process'
      );
    }

    // Generate JWT

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        telephone: existingUser.telephone,
        userType: existingUser.userType,
        status: existingUser.status,
      },
      process.env.JWT_KEY!
    );

    // store it on session object

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
