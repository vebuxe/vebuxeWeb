import express, { Request, Response } from 'express';
import { BadRequestError } from '@vboxdev/common';
import { User } from '../models/user';
import { Code } from '../models/code';
import { body } from 'express-validator';
import { email } from './email/email';

import { maskPhoneNumber } from 'mask-phone-number';

const router = express.Router();

router.get(
  '/api/users/request/verification',
  body('telephone')
    .notEmpty()
    .matches(/^\d+$/)
    .withMessage('Invalid telephone number'),
  [email],
  async (req: Request, res: Response) => {
    const { telephone } = req.body;
    const existingUser = await User.findOne({ telephone });

    if (!existingUser) {
      // console.log('Email in use');

      throw new BadRequestError('User with telephone number does not exist');
    }

    var phone = '+' + existingUser.telephone;

    var maskedPhoneNumber = maskPhoneNumber(phone);

    res.status(201).send({
      successful: true,
      code: 200,
      message: 'Code Sent.',
      masked_phone: maskedPhoneNumber,
    });
  }
);

export { router as RequestVerificationCodeRouter };
