import express, { Request, Response } from 'express';

import {  BadRequestError,NotAuthorizedError } from '@vboxdev/common';
import { User } from '../models/user';
import {VerificationStatus} from '../services/verification-status'



const router = express.Router();

router.post(
  '/api/users/email-verification/:userId',

  

  async (req: Request, res: Response) => {

    const userId = req.params.userId
  

    const user = await User.findById(req.params.userId);


    if (!user) {
      throw new NotAuthorizedError();
    }

    if (user.verification === VerificationStatus.Verified  ) {
      throw new BadRequestError("User is already verified");
    }

    if (user.verification === VerificationStatus.Expire  ) {
      throw new BadRequestError("Verification link already expired");
    }



    user.verification = VerificationStatus.Verified;
    await user.save();




    res.send(user);

    // store it on session object

  

  }
);

export { router as EmailVerificationRouter };
