import express, { Response, Request } from 'express';
import { User } from '../models/user';
import { body } from 'express-validator';
import { NotFoundError, requireAuth, currentUser, NotAuthorizedError } from '@vboxdev/common';

const router = express.Router();

router.put(
  '/api/users/:userid',
  currentUser,
  requireAuth,

  async (req: Request, res: Response) => {
    const {
      email,
      password,
      username,
      telephone,
      userType,
      status,
    } = req.body;
    const userId = req.params.userid;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

   
     if (user.id != req.currentUser!.id) {
    throw new NotAuthorizedError();
    }

    if (email) {
      user.set({ email });
    }

    if (password) {
      user.set({ password });
    }
    if (password) {
      user.set({ password });
    }
    if (username) {
      user.set({ username });
    }
 
    if (telephone) {
      user.set({ telephone });
    }
    if (userType) {
      user.set({ userType });
    }
  
    if (status) {
      user.set({ status });
    }

    await user.save();

    res.send(user);
  }
);

export { router as UserUpdateRouter };
