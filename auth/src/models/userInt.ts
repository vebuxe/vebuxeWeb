import mongoose from 'mongoose';
import { UserType } from '@vboxdev/common';

// An interface that describe the properties that are required to create a new User

interface UserIntAttrs {
  fullname: string;
  telephone: string;
  email: string;
  userType: UserType;
}

// An interface that describes the properties that a user model has

 interface UserIntModel extends mongoose.Model<UserIntDoc> {
  build(attrs: UserIntAttrs): UserIntDoc;
}

// An interface that describes the properties that a user document has

 interface UserIntDoc extends mongoose.Document {
   fullname: string;
   telephone: string;
   email: string;
   userType: UserType;
 }

const UserIntSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    telephone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      required: true,
      enum: Object.values(UserType),
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





UserIntSchema.statics.build = (attrs: UserIntAttrs) => {
  return new UserInt(attrs);
};

const UserInt = mongoose.model<UserIntDoc, UserIntModel>(
  'UserInt',
  UserIntSchema
);

export { UserInt };
