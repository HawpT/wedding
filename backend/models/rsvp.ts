import * as mongoose from 'mongoose';
import { Schema, Model, Document, Types } from 'mongoose';

export interface RSVP extends Document {
  userId             : Types.ObjectId,
  attending          : Boolean,
  plusOne            : String,
  thursdayNight      : Boolean,
  fridayNight        : Boolean,
  saturdayNight      : Boolean,
  accommodation      : String,
  thursdayDinner     : Boolean,
  fridayBreakfast    : Boolean,
  fridayLunch        : Boolean,
  rehearsalDinner    : Boolean,
  mealHelp           : Boolean,
  bridesBrunch       : Boolean,
  boysBrews          : Boolean,
  plusOneBridesBrunch: Boolean,
  plusOneBoysBrews   : Boolean,
  notes              : String,
  angelsLanding      : Boolean,
  createdAt          : Date,
  updatedAt          : Date
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
  accommodation: {
    type: String
  },
  thursdayDinner: {
    type: Boolean
  },
  fridayBreakfast: {
    type: Boolean
  },
  fridayLunch: {
    type: Boolean
  },
  rehearsalDinner: {
    type: Boolean
  },
  mealHelp: {
    type: Boolean
  },
  bridesBrunch: {
    type: Boolean
  },
  boysBrews: {
    type: Boolean
  },
  plusOneBridesBrunch: {
    type: Boolean
  },
  plusOneBoysBrews: {
    type: Boolean
  },
  notes: {
    type: String
  },
  angelsLanding: {
    type: Boolean
  },
}, {
  collection: 'rsvps',
  timestamps: true
});

export default mongoose.model<RSVP>('RSVP', schema);