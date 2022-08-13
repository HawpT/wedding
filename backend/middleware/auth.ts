/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// middlewares/auth.js

import Role, { IRoleAction, IAction, defaultRoleAction } from '../models/role';
import jwt, { JwtPayload } from 'jsonwebtoken';
import user from '../models/user';
import rsvp from '../models/rsvp';
import test from '../models/test.model';

async function checkUserData(userId, id) : Promise<Boolean> {
  if (userId === id)
    return true;
  try {
    const rsvps = await rsvp.find({
      _id: id,
      userId: userId
    }, {_id: 1});
    const tests = await test.find({
      _id: id,
      userId: userId
    }, {_id: 1});
    return rsvps.length + tests.length > 0;
  }
  catch(err) {
    return false;
  }
  return false;
}

export default async function authroize(req, res, next) {
  function errorMessage(id, subject, action) {
    return new Error(`User[${id}] is not authorizied. Subject: ${subject}. Action: ${action}`);
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    const info = jwt.verify(token, process.env.JWT_PRIV_KEY) as JwtPayload;
    if (info.exp - info.iat > (parseInt(process.env.AUTH_TOKEN_TIMEOUT) * 1000))
      throw new Error('Auth token has expired. Please log in.');
    const userRoles = info['roles'];
    const userId = info['userId'];
    const params = req.originalUrl.slice(1).split('/');
    const subject = params[1];
    const action = params[2];
    const id = params.length > 3 ? params[3] : null;
    const noAuthActions = ['login', 'register'];
    
    if (noAuthActions.includes(subject)) return next();

    if (userId)
      req.body.userId = userId;

    if (subject === 'user' && action === 'current') {
      req.currentUserId = userId;
      return next();
    }

    if (subject === 'data' && userId === id){
      req.currentUserId = userId;
      return next();
    }

    const targetingSelf = await checkUserData(userId, id);
    Role.find((error, data) => {
      if (error) {
        throw 'Cannot find roles';
      } else {
        //error must be handled internally to prevent server from crashing
        try {
          const role = data.find(d => {
            if (userRoles.includes(d.name)) {
              const actions: IAction = d.actions[subject];
              return ((action === 'create' && actions.create) ||
                (action === 'update' && (actions.edit && targetingSelf || actions.editall)) ||
                (action === 'delete' && (actions.delete && targetingSelf || actions.deleteall)) ||
                (action === 'read' && actions.view && targetingSelf) ||
                (action === 'list' && actions.viewall));
            }
          });
          if (role)
            return next();
          throw errorMessage(userId, subject, action);
        } catch (error) {
          return next(error);
        }
      }
    });
  } catch (error) {
    return next(error);
  }
}
