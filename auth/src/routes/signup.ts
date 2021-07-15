import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  validateRequest,
  BadRequestError,
  VerificationStatus,
} from '@vboxdev/common';
import { User } from '../models/user';
import { email } from './email/email';
import { natsWrapper } from '../nats-wrapper';
import { UserCreatedPublisher } from '../events/publisher/user-created-publisher';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const router = express.Router();

router.post(
  '/api/users/signup',

  [
    body('email')
      .normalizeEmail()
      .trim()
      .isEmail()
      .withMessage('Email must be vaild'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 4 and 20 chracters')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
    body('username').not().isEmpty().withMessage('Firstname is required'),
    body('telephone')
      .notEmpty()
      .matches(/^\d+$/)
      .withMessage('Invalid telephone number'),
  ],
  validateRequest,
  [email],

  async (req: Request, res: Response) => {
    const { email, password, username, telephone, userType } = req.body;

    const existingUser = await User.findOne({ email });
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 60 * 2);

    if (existingUser) {
      // console.log('Email in use');
      // return res.send({})
      throw new BadRequestError('Email Already In Use');
    }

    const verification_code = Math.floor(Math.random() * 899999 + 100000);

    console.log(verification_code);

    client.messages
      .create({
        body: `${verification_code} is your verification code for VBOX`,
        from: '+15209993884',
        to: '+'+telephone,
      })
      //@ts-ignore
      .then((message) => console.log(message))
      //@ts-ignore
      .catch((error) => console.log(error));

    const user = User.build({
      email,
      password,
      username,
      telephone,
      userType,
      verification: VerificationStatus.Unverified,
      verification_code,
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

    res.status(201).send(user);
  }
);

export { router as signupRouter };
