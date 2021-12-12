import * as mongoose from 'mongoose';
import { Schema, Model, Document, Types } from 'mongoose';

export interface ITest extends Document {
  userId: Types.ObjectId,
  createdAt: Date,
  updatedAt: Date
}

// Define collection and schema
const schema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User'
  }
}, {
  collection: 'tests',
  timestamps: true
});

export default mongoose.model<ITest>('Test', schema);