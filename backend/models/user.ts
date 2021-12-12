import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser extends Document {
  nameFirst: string,
  nameLast: string,
  email: string,
  emailVerified: Boolean,
  emailVerificationUUID: string,
  emailVerificationTimeout: Date,
  passwordResetUUID: string,
  passwordResetTimeout: Date,
  password: string,
  roles: Object[],
  createdAt: Date,
  updatedAt: Date
}

// Define collection and schema
const schema = new Schema({
  nameFirst: {
    type: String
  },
  nameLast: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  emailVerified: {
    type: Boolean
  },
  emailVerificationUUID: {
    type: String
  },
  emailVerificationTimeout: {
    type: Date
  },
  passwordResetUUID: {
    type: String
  },
  passwordResetTimeout: {
    type: Date
  },
  password: {
    type: String
  },
  roles: {
    type: [Object]
  },
}, {
  collection: 'users',
  timestamps: true
});

schema.plugin(uniqueValidator, {
  message: 'Email already in use.'
});

export default mongoose.model<IUser>('User', schema);