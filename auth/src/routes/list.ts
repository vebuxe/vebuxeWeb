import express, { Request, Response } from 'express';
import { currentUser, NotFoundError } from '@vboxdev/common';
import { User } from '../models/user';

const router = express.Router();

router.get(
  '/api/users/',

 async (req: Request, res: Response) => {
    
   const user = await User.find({});

   if (!user) {
    throw new NotFoundError();
   }
  

   res.send(user);
  }
);

export { router as ListUserRouter };
