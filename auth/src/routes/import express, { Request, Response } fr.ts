import express, { Request, Response } from 'express';
import {
  requireAuth,
  requireAuthAdmin,
  BadRequestError,
} from '@vboxdev/common';
import formidable from 'formidable';
import _ from 'lodash';
import fs from 'fs';
import { Movies } from '../models/movies';
import { User } from '../models/users';
import { Category } from '../models/category';
import bodyParser from 'body-parser';
const router = express.Router();

router.post(
  '/api/movies/',
  requireAuth,
  requireAuthAdmin,

  async (req: Request, res: Response) => {
    // get user model doc
    const user = await User.findById(req.currentUser!.id);
    if (!user) {
      throw new BadRequestError(
        'User cannot create a movie because user not found.'
      );
    }

    let form = new formidable.IncomingForm();
    // form.maxFileSize = 1000 * 1024 * 1024;

    // form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'File could not be uploaded' });
      }
      // check for all fields
      const { title, description, category, cast, rate } = fields;

      if (!title || !description || !category || !cast || !rate) {
        return res.status(400).json({
          error: ' All fields are required ',
        });
      }

      // get category model doc

      const cat = await Category.findById(category);
      if (!cat) {
        throw new BadRequestError(
          'Category ID provided is invalid or does not exist!!!'
        );
      }

      let movies = new Movies(fields);
      if (files.file) {
        // console.log('FILES PHOTO', files.file);
        // @ts-ignore
        movies.file.data = fs.readFileSync(files.file.path, 'utf8');
        // @ts-ignore
        movies.file.contentType = files.file.type;
        // @ts-ignore
        movies.file.path = files.file.path;
        // @ts-ignore
        movies.file.name = files.file.name;
      } else {
        return res.status(400).json({
          error: ' File fields are required ',
        });
      }

      // insert user model doc
      movies.user = user;
      // insert category model doc
      movies.category = cat;

      movies.save((err, result) => {
        if (err) {
          return res.status(400).json(err);
        }
        res.json(result);
      });
    });
  }
);

export { router as CreateNewRouter };
