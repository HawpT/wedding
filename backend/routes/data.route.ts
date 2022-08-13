import * as express from 'express';
import { Schema, Types } from 'mongoose';
import authorize from '../middleware/auth';

//Models
import rsvp from '../models/rsvp';
import Test from '../models/test.model';
import User from '../models/user';

const dataRoute = express.Router();
export default dataRoute;

// Get All User Data for specific user
dataRoute.route('/read/:id').get(authorize, (req, res, next) => {
  const id = new Types.ObjectId(req.params.id);

  Promise.all([
    rsvp.find({
      userId: id
    }),
    User.find({
      userId: id
    }),
    Test.find({
      userId: id
    })
  ]).then(([rsvp, user, test]) => {
    res.json({
      rsvp: rsvp,
      user: user,
      test: test
    });
  }).catch((err) => {
    return next(err);
  });

});
