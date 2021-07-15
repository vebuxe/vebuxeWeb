import express, { Request, Response } from 'express';
import { currentUser } from '@vboxdev/common';

const router = express.Router();

router.post('/api/movies/', (req: Request, res: Response) => {
  res.send('working movies');
});

export { router as CreateNewRouter };
