import * as mongoose from 'mongoose';
import { Model, Schema, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IRole extends Document {
  userId: Types.ObjectId,
  name: string,
  actions: Object,
  createdAt: Date,
  updatedAt: Date
}

// Define collection and schema
const schema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    unique: true
  },
  actions: {
    type: Object
  }
}, {
  collection: 'roles',
  timestamps: true
});

schema.plugin(uniqueValidator, {
  message: 'Role name already in use.'
});

export default mongoose.model<IRole>('Role', schema);