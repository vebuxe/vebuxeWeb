import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { email } from './email/password-mail';

const router = express.Router();

router.post(
  '/api/users/password-reset-email',

  body('email').isEmail().withMessage('Email must be valid.'),

  email,
  async (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as PasswordResetEmailRouter };
