import mongoose from 'mongoose';
import { UserDoc } from './users';
import { CategoryDoc } from './category';

// An interface that describe the properties that are required to create a new User

interface MoviesAttrs {
  title: string;
  description: string;
  category: CategoryDoc;
  user: UserDoc;
  director: string;
  cast: string;
  rate: string;
  file: Buffer;
}

interface MoviesModel extends mongoose.Model<MoviesDoc> {
  build(attrs: MoviesAttrs): MoviesDoc;
}

// An interface that describes the properties that a user document has

interface MoviesDoc extends mongoose.Document {
  title: string;
  description: string;
  category: CategoryDoc;
  user: UserDoc;
  director: string;
  cast: string;
  rate: string;
  file: Buffer;
}

const MoviesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },

    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 10000,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cast: {
      type: String,
      trim: true,
      maxlength: 10000,
    },
    rate: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },

    file: {
      data: Buffer,
      contentType: String,
      path: String,
      name: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

MoviesSchema.statics.build = (attrs: MoviesAttrs) => {
  return new Movies(attrs);
};

const Movies = mongoose.model<MoviesDoc, MoviesModel>('Movies', MoviesSchema);

export { Movies };
