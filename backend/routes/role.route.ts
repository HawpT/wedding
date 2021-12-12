import * as express from 'express';
import authorize from '../middleware/auth';

// Role Info model
import Role from '../models/role';

const roleRoute = express.Router();
export default roleRoute;

// Add Role Info
roleRoute.route('/create').post(authorize, (req, res, next) => {
  Role.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get All Role Info
roleRoute.route(['/', '/list']).get((req, res, next) => {
  Role.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get single Role info
roleRoute.route('/read/:id').get((req, res, next) => {
  Role.findById(req.params.id, {}, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update Role Info
roleRoute.route('/update/:id').post(authorize, (req, res, next) => {
  Role.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Delete Role info
roleRoute.route('/delete/:id').delete(authorize, (req, res, next) => {
  Role.findByIdAndRemove(req.params.id, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      });
    }
  });
});