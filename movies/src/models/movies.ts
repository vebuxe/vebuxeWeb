import mongoose from 'mongoose';

// An interface that describe the properties that are required to create a new User

interface MoviesAttrs {
  title: string;
  description: string;
  category: string;
  user: string;
  file: Buffer;
}

interface MoviesModel extends mongoose.Model<MoviesDoc> {
  build(attrs: MoviesAttrs): MoviesDoc;
}

// An interface that describes the properties that a user document has

interface MoviesDoc extends mongoose.Document {
  security: string;
  year: string;
  filename: string;
  file: Buffer;
}

const MoviesSchema = new mongoose.Schema(
  {
    security: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },

    year: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    filename: {
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

const Movies = mongoose.model<MoviesDoc, MoviesModel>(
  'Movies',
  MoviesSchema
);

export { Movies };
