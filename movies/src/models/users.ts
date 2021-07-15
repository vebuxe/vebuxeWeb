import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { VerificationStatus } from '@vboxdev/common';

interface UserAttrs {
  id: string;
  email: string;
  username: string;
  userType: number;
  telephone: number;
  verification: VerificationStatus;
  status: number;
  expiresAt: Date;
}

export interface UserDoc extends mongoose.Document {
  id: string;
  version: number;
  email: string;
  username: string;
  userType: number;
  telephone: number;
  verification: VerificationStatus;
  status: number;
  expiresAt: Date;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: { id: string; version: number }): Promise<UserDoc | null>;
}

const UserSchema = new mongoose.Schema(
  {
    username: {
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
      type: Number,
      default: 0,
    },

    verification: {
      type: String,
      required: true,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.Unverified,
    },
    status: {
      type: Number,
      default: 1,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);

UserSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    username: attrs.username,
    telephone: attrs.telephone,
    email: attrs.email,
    userType: attrs.userType,
    verification: attrs.verification,
    status: attrs.status,
    expiresAt: attrs.expiresAt,
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };
