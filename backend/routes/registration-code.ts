import * as express from 'express';
import authorize from '../middleware/auth';

// registrationCode Info model
import registrationCodeModel from '../models/registration-code';

const registrationCodeRoute = express.Router();
export default registrationCodeRoute;

// Add registrationCode Info
registrationCodeRoute.route('/create').post(authorize, (req, res, next) => {
  const registrationCodeObject = req.body;
  registrationCodeModel.create(registrationCodeObject, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get All registrationCodes
registrationCodeRoute.route(['/', '/list']).get(authorize, (req, res, next) => {
  registrationCodeModel.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get single registrationCode
registrationCodeRoute.route('/read/:id').get(authorize, (req, res, next) => {
  registrationCodeModel.findById(req.params.id, {}, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update registrationCode
registrationCodeRoute.route('/update/:id').post(authorize, (req, res, next) => {
  registrationCodeModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Delete registrationCode
registrationCodeRoute.route('/delete/:id').delete(authorize, (req, res, next) => {
  registrationCodeModel.findByIdAndRemove(req.params.id, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      });
    }
  });
});