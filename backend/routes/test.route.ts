import * as express from 'express';
import authorize from '../middleware/auth';
import { upload } from '../routes/uploads/image.helper';

// Staff Info model
import testModel from '../models/test.model';

const testRoute = express.Router();
export default testRoute;

// Add Staff Info
testRoute.route('/create').post(authorize, upload.single('covidVaccineImage'), (req, res, next) => {
  const testObject = req.body;
  testModel.create(testObject, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get All Tests
testRoute.route(['/', '/list']).get(authorize, (req, res, next) => {
  testModel.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Get single test
testRoute.route('/read/:id').get(authorize, (req, res, next) => {
  testModel.findById(req.params.id, {}, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update test
testRoute.route('/update/:id').post(authorize, (req, res, next) => {
  testModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Delete test
testRoute.route('/delete/:id').delete(authorize, (req, res, next) => {
  testModel.findByIdAndRemove(req.params.id, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      });
    }
  });
});