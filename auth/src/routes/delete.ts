import express, { Request, Response } from 'express';
import { currentUser, NotFoundError } from '@vboxdev/common';
import { User } from '../models/user';

const router = express.Router();

router.delete(
  '/api/users/:userId',

 async (req: Request, res: Response) => {
    
    const { userId } = req.params;

   const user = await User.findById(userId);

   if (!user) {
    throw new NotFoundError();
   }


   user.remove();

   res.send({
     success: true,
     message: 'User deleted successful!',
     code: 201,
   });
  }
);

export { router as deleteUserRouter };
