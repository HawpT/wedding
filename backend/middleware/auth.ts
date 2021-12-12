/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// middlewares/auth.js

import Role from '../models/role';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default function authroize(req, res, next) {
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
    const targetingSelf = id === userId;

    //console.log(params);

    const noAuthActions = ['login', 'register'];
    if (noAuthActions.includes(subject)) return next();

    if (subject === 'user' && action === 'current') {
      req.currentUserId = userId;
      return next();
    }

    Role.find((error, data) => {
      if (error) {
        throw 'Cannot find roles';
      } else {
        //error must be handled internally to prevent server from crashing
        try {
          const authorizedActions = {};

          data.forEach(d => {
            if (userRoles.includes(d.name)) {
              Object.keys(d.actions).forEach(k => {
                const subjects = Object.keys(d.actions[k]);
                if (!authorizedActions[k]) authorizedActions[k] = {};
                subjects.forEach(s => {
                  authorizedActions[k][s] = authorizedActions[k][s] || d.actions[k][s];
                });
              });
            }
          });

          //console.log(subject + ' ' + action + ' ' + id);
          //console.log(authorizedActions);
          if (!authorizedActions) throw 'No authorized actions for user on ' + subject;

          if (action === 'create' && !authorizedActions[subject]['create']) throw errorMessage(userId, subject, action);
          else if (action === 'update' && targetingSelf && !authorizedActions[subject]['edit']) throw errorMessage(userId, subject, action);
          else if (action === 'update' && !authorizedActions[subject]['edit-all']) throw errorMessage(userId, subject, action);
          else if (action === 'delete' && targetingSelf && !authorizedActions[subject]['delete']) throw errorMessage(userId, subject, action);
          else if (action === 'delete' && !authorizedActions[subject]['delete-all']) throw errorMessage(userId, subject, action);
          else if (action === 'read' && targetingSelf && !authorizedActions[subject]['view']) throw errorMessage(userId, subject, action);
          else if (action === 'list' && !authorizedActions[subject]['view-all']) throw errorMessage(userId, subject, action);

          next();
        } catch (error) {
          //TODO logging
          res.status(401).json({
            message: 'user not authorized'
          });
        }
      }
    });
  } catch (error) {
    //TODO internal auth error logging
    res.status(401).json({
      message: `Unauthorized: ${error.message}`
    });
  }
}