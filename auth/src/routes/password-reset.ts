import express, {Request, Response} from 'express';
import { NotAuthorizedError, BadRequestError,validateRequest } from '@vboxdev/common';
import {User} from '../models/user'
import { body } from 'express-validator';
import { UserUpdatedPublisher } from '../events/publisher/user-updated-publisher ';
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
      .notEmpty()
      .matches(/^\d+$/)
      .withMessage('Invalid telephone number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { password, rpassword, code,telephone } = req.body;



      const user = await User.findOne({ telephone });

    if (!user) {
      throw new NotAuthorizedError();
    }

     if (rpassword !== password) {
       throw new BadRequestError('Password do not match');
    }
    
     if (code && user.verification_code != code) {
       throw new BadRequestError('Invalid verification code.');
     }

    user.set({
      password: password,
      verification_code: 0,
    });

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
    });
  }
);

export {
    router as PasswordResetRouter
};
