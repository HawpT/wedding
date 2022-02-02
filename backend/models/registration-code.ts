import * as mongoose from 'mongoose';
import { Model, Schema, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IRegistrationCode extends Document {
  code: string,
  claimed: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Define collection and schema
const schema = new Schema({
  code: {
    type: String,
    unique: true
  },
  claimed: {
    type: Boolean
  }
}, {
  collection: 'registration-codes',
  timestamps: true
});

schema.plugin(uniqueValidator, {
  message: 'RegistrationCode name already in use.'
});

export default mongoose.model<IRegistrationCode>('RegistrationCode', schema);