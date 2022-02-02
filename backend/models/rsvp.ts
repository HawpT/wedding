import * as mongoose from 'mongoose';
import { Schema, Model, Document, Types } from 'mongoose';

export interface OtherMeal extends Document {
  name: String,
  attending: Boolean,
}
export interface RSVP extends Document {
  userId: Types.ObjectId,
  attending: Boolean,
  plusOne: String,
  thursdayNight: Boolean,
  fridayNight: Boolean,
  saturdayNight: Boolean,
  rehearsalDinner: Boolean,
  otherMeals: [OtherMeal],
  createdAt: Date,
  updatedAt: Date
}

// Define collection and schema
const schema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User'
  },
  attending: {
    type: Boolean
  },
  plusOne: {
    type: String
  },
  thursdayNight: {
    type: Boolean
  },
  fridayNight: {
    type: Boolean
  },
  saturdayNight: {
    type: Boolean
  },
  rehearsalDinner: {
    type: Boolean
  },
  otherMeals: {
    type: [Object]
  }

}, {
  collection: 'rsvps',
  timestamps: true
});

export default mongoose.model<RSVP>('RSVP', schema);