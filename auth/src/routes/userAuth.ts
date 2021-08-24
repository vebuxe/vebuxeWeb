import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
} from '@vboxdev/common';
import { User } from '../models/user';



const router = express.Router();

router.post(
  '/api/users/signup',

  [
 
    body('telephone')
      .notEmpty()
      .matches(/^\d+$/)
      .withMessage('Invalid telephone number'),
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const { email, telephone } =
      req.body;

    let existingUser;

    if (email) {
      existingUser = await User.findOne({
        $or: [{ email }, { telephone }],
      });
    } else {
      existingUser = await User.findOne({ telephone });
    }

  

 
  

 

    res.status(201).send({
      success: true,
      message: 'User exist!',
      code: 201,
      existingUser,
    });
  }
);

export { router as userAuthRouter };
