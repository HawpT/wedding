import * as express from 'express';
import authorize from '../middleware/auth';

// Rsvp Info model
import rsvpModel from '../models/rsvp';

const rsvpRoute = express.Router();
export default rsvpRoute;

// Add Rsvp Info
rsvpRoute.route('/create').post(authorize, (req, res, next) => {
  const rsvpObject = req.body;
  rsvpModel.create(rsvpObject, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get All rsvps
rsvpRoute.route(['/', '/list']).get(authorize, (req, res, next) => {
  rsvpModel.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get single rsvp by user ID
rsvpRoute.route('/user/:id').get(authorize, (req, res, next) => {
  rsvpModel.findOne({userId: req.params.id}, {}, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get current user's RSVP
rsvpRoute.route('/user').get(authorize, (req, res, next) => {
  rsvpModel.findOne({userId: req.body.userId}, {}, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get single rsvp
rsvpRoute.route('/read/:id').get(authorize, (req, res, next) => {
  
  rsvpModel.findById(req.params.id, {}, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update rsvp
rsvpRoute.route('/update/:id').post(authorize, (req, res, next) => {
  rsvpModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Delete rsvp
rsvpRoute.route('/delete/:id').delete(authorize, (req, res, next) => {
  rsvpModel.findByIdAndRemove(req.params.id, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      });
    }
  });
});