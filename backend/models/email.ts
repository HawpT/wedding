import * as mongoose from 'mongoose';
import { Schema, Model, Document, Types } from 'mongoose';

export interface IEmail extends Document {
  nameFirst: String,
  nameLast: String,
  email: String,
  subject: String,
  body: String,
  link: String,
  sent: Boolean,
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
    type: String
  },
  subject: {
    type: String
  },
  body: {
    type: String
  },
  link: {
    type: String
  },
  sent: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'emails',
  timestamps: true
});

export default mongoose.model<IEmail>('Email', schema);