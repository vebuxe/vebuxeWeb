import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  validateRequest,
  BadRequestError,
  VerificationStatus,
} from '@vboxdev/common';
import { User } from '../models/user';

import { natsWrapper } from '../nats-wrapper';
import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';



const router = express.Router();

router.post(
  '/api/users/signup',

  [
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 4 and 20 chracters')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
    body('rpassword')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 4 and 20 chracters')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
    body('fullname').not().isEmpty().withMessage('Fullname is required'),
    body('telephone')
      .notEmpty()
      .matches(/^\d+$/)
      .withMessage('Invalid telephone number'),
  ],
  validateRequest,


  async (req: Request, res: Response) => {
    const { email, password, fullname, telephone, userType, rpassword } =
      req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { telephone }],
    });
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 60 * 2000);

    if (existingUser) {
      // console.log('Email in use');
      // return res.send({})
      throw new BadRequestError('Email or Telephone Already In Use');
    }

    if (rpassword !== password) {
          throw new BadRequestError('Password do not match');
       }

 
 

    const user = User.build({
      email,
      password,
      username: fullname,
      telephone,
      userType,
      verification: VerificationStatus.Unverified,
      verification_code: 0,
      expiresAt: expiration,
    });

    await user.save();

    //Publish an event that a user was created

    new UserCreatedPublisher(natsWrapper.client).publish({
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

    // Generate JWT

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        telephone: user.telephone,
        userType: user.userType,
        status: user.status,
      },
      process.env.JWT_KEY!
    );

    // store it on session object

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send({
      success: true,
      message: 'Registration was successful!',
      code: 201,
      verification: user.verification,
      user,
    });
  }
);

export { router as signupRouter };
