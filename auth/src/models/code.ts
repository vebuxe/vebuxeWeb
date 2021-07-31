import mongoose from 'mongoose';
import { VerificationStatus, CodeType } from '@vboxdev/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
interface CodeAttrs {
  user: string;
  verification: VerificationStatus;
  verification_code: number;
  codeType: CodeType;
  masked_phone: string;
  expiresAt: Date;
}

 interface CodeDoc extends mongoose.Document {
  user: string;
  version: number;
  verification: VerificationStatus;
  verification_code: number;
  codeType: CodeType;
  masked_phone: string;
  expiresAt: Date;
}

interface CodeModel extends mongoose.Model<CodeDoc> {
  build(attrs: CodeAttrs): CodeDoc;
}

const CodeSchema = new mongoose.Schema(
  {
    verification: {
      type: String,
      required: true,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.Unverified,
    },
    verification_code: {
      type: Number,
      default: 0,
    },
    user: {
      type: String,
      required: true,
    },
    codeType: {
      type: String,
      required: true,
      enum: Object.values(CodeType),
      default: CodeType.Free,
    },
    masked_phone: {
      type: String,
      required: true,
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

CodeSchema.set('versionKey', 'version');
CodeSchema.plugin(updateIfCurrentPlugin);


CodeSchema.statics.build = (attrs: CodeAttrs) => {
  return new Code(attrs);
};

const Code = mongoose.model<CodeDoc, CodeModel>(
  'Code',
  CodeSchema
);

export { Code };
