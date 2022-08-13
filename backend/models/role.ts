import * as mongoose from 'mongoose';
import { Model, Schema, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IAction {
  create: Boolean,
  edit: Boolean,
  delete: Boolean,
  view: Boolean,
  viewall: Boolean,
  editall: Boolean,
  deleteall: Boolean
}

export interface IRoleAction {
  rsvp: IAction,
  'registration-code': IAction,
  admin: IAction,
  user: IAction,
  role: IAction,
  test: IAction,
}

export function defaultRoleAction(): IRoleAction {
  return {
    rsvp: {
      create: false,
      edit: false,
      delete: false,
      view: false,
      viewall: false,
      editall: false,
      deleteall: false
    },
    'registration-code': {
      create: false,
      edit: false,
      delete: false,
      view: false,
      viewall: false,
      editall: false,
      deleteall: false
    },
    admin: {
      create: false,
      edit: false,
      delete: false,
      view: false,
      viewall: false,
      editall: false,
      deleteall: false
    },
    user: {
      create: false,
      edit: false,
      delete: false,
      view: false,
      viewall: false,
      editall: false,
      deleteall: false
    },
    role: {
      create: false,
      edit: false,
      delete: false,
      view: false,
      viewall: false,
      editall: false,
      deleteall: false
    },
    test: {
      create: false,
      edit: false,
      delete: false,
      view: false,
      viewall: false,
      editall: false,
      deleteall: false
    },
  };
}

export interface IRole extends Document {
  userId: Types.ObjectId,
  name: string,
  actions: IRoleAction,
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
    rsvp: {
      create: Boolean,
      edit: Boolean,
      delete: Boolean,
      view: Boolean,
      viewall: Boolean,
      editall: Boolean,
      deleteall: Boolean
    },
    'registration-code': {
      create: Boolean,
      edit: Boolean,
      delete: Boolean,
      view: Boolean,
      viewall: Boolean,
      editall: Boolean,
      deleteall: Boolean
    },
    admin: {
      create: Boolean,
      edit: Boolean,
      delete: Boolean,
      view: Boolean,
      viewall: Boolean,
      editall: Boolean,
      deleteall: Boolean
    },
    user: {
      create: Boolean,
      edit: Boolean,
      delete: Boolean,
      view: Boolean,
      viewall: Boolean,
      editall: Boolean,
      deleteall: Boolean
    },
    role: {
      create: Boolean,
      edit: Boolean,
      delete: Boolean,
      view: Boolean,
      viewall: Boolean,
      editall: Boolean,
      deleteall: Boolean
    },
    test: {
      create: Boolean,
      edit: Boolean,
      delete: Boolean,
      view: Boolean,
      viewall: Boolean,
      editall: Boolean,
      deleteall: Boolean
    },
  }
}, {
  collection: 'roles',
  timestamps: true
});

schema.plugin(uniqueValidator, {
  message: 'Role name already in use.'
});

export default mongoose.model<IRole>('Role', schema);
