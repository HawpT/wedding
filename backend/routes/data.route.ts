import * as express from 'express';
import { Schema, Types } from 'mongoose';
import authorize from '../middleware/auth';

//Models
import rsvp from '../models/rsvp';
import Test from '../models/test.model';
import User from '../models/user';

const dataRoute = express.Router();
export default dataRoute;

// Get All User Data
dataRoute.route('/:id').get(authorize, (req, res, next) => {
  const id = new Types.ObjectId(req.params.id);

  User.find().then();

  Promise.all([
    rsvp.find({
      userId: id
    }),
    Test.find({
      userId: id
    })
  ]).then(([rsvp,  test]) => {
    res.json({
      rsvp: rsvp,
      test: test
    });
  }).catch((err) => {
    return next(err);
  });

});