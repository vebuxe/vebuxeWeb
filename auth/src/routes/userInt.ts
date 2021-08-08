import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  validateRequest,
  BadRequestError,
  VerificationStatus,
} from '@vboxdev/common';
import { UserInt } from '../models/userInt';

import { natsWrapper } from '../nats-wrapper';
import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';



const router = express.Router();

router.post(
  '/api/users/int',

  [
    body('email').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const { email, fullname, telephone, userType } = req.body;

    const existingUser = await UserInt.findOne({email});
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 60 * 2000);

    if (existingUser) {
      // console.log('Email in use');
      // return res.send({})
      throw new BadRequestError('Email or Telephone Already In Use');
    }

  

    const user = UserInt.build({
      email,
      fullname,
      telephone,
      userType,
    });

    await user.save();

   


    res.status(201).send({
      success: true,
      message: 'Registration was successful!',
      code: 201,
      user,
    });
  }
);

export { router as UserIntRouter };
