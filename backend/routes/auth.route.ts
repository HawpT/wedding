import * as express from 'express';
import crypto from 'crypto';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authorize from '../middleware/auth';
import User, { IUser } from '../models/user';
import RegistrationCode, { IRegistrationCode } from '../models/registration-code';
import { createPasswordResetEmail, createVerificationEmail } from '../services/email.service';
import { DateTime } from 'luxon';
import { constants } from 'buffer';

const auth = express.Router();
export default auth;

const EMAIL_VALIDATION = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$/;
const MAX_LEN_10 = /.{1,10}/;
const MAX_LEN_25 = /.{1,25}/;
const MAX_LEN_50 = /.{1,50}/;
const MAX_LEN_100 = /.{1,100}/;
const MAX_LEN_200 = /.{1,200}/;
const MAX_LEN_500 = /.{1,500}/;

export async function createEmailVerificationUUID(user: IUser): Promise<IUser> {
  if (user.emailVerificationUUID && user.emailVerificationTimeout && DateTime.fromJSDate(user.emailVerificationTimeout) > DateTime.now())
    return user.save();
  user.emailVerificationUUID = crypto.randomUUID();
  const timeout = DateTime.now().plus({ hours: 1 });
  user.emailVerificationTimeout = timeout.toJSDate();
  return user.save();
}

export async function createPasswordResetUUID(user: IUser): Promise<IUser> {
  if (user.passwordResetUUID && user.passwordResetTimeout && DateTime.fromJSDate(user.passwordResetTimeout) > DateTime.now())
    return user.save();
  user.passwordResetUUID = crypto.randomUUID();
  const timeout = DateTime.now().plus({ hours: 1 });
  user.passwordResetTimeout = timeout.toJSDate();
  return user.save();
}

// register
auth.route('/register').post(
  [
    //first name
    check('nameFirst', 'Name must be 3 to 50 characters long')
      .not()
      .isEmpty()
      .isLength({
        min: 2,
        max: 50
      }),
    //last name
    check('nameLast', 'Name must be 3 to 50 characters long')
      .not()
      .isEmpty()
      .isLength({
        min: 2,
        max: 50
      }),
    //email
    check('email', 'Email is required')
      .not()
      .isEmpty()
      .matches(EMAIL_VALIDATION, 'i'),
    //password
    check('password', 'Invalid password')
      .not()
      .isEmpty()
      .matches(PASSWORD_VALIDATION),
    //passwordConf
    check('passwordConf', 'Passwords should match.')
      .if((value, {
        req
      }) => req.body.password !== req.body.passwordConf),
    check('registrationCode', 'Registration Code Required')
      .not()
      .isEmpty()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      } else {
        const regCode = await RegistrationCode.findOne({ code: req.body.registrationCode}).exec();
        if (!regCode) {
          return res.status(500).json({
            message: 'Could not find registration code.'
          });
        }
        if (regCode.claimed) {
          return res.status(500).json({
            message: 'The registration code has already been claimed.'
          });
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
        req.body.emailVerified = false;
        req.body.roles = ['user'];
        req.body.registrationCodeId = regCode._id;
        let newUser = await User.create(req.body);
        newUser = await createEmailVerificationUUID(newUser);
        createVerificationEmail(newUser);
        regCode.claimed = true;
        regCode.save();
        return res.status(201).json({
          message: 'User successfully created!'
        });
      }
    } catch (e) {
      return res.status(500).json({
        message: e.message
      });
    }
  }
);

// Sign-in
auth.route('/login').post(async (req, res, next) => {
  try {
    let user = await User.findOne({
      email: req.body.email
    });
    if (!user) {
      return res.status(401).json({
        message: 'Your email or password is incorrect.'
      });
    }
    const correctPassword = await bcrypt.compare(req.body.password, user.password);
    if (!correctPassword) {
      return res.status(401).json({
        message: 'Your email or password is incorrect.'
      });
    }
    if (!user.emailVerified) {
      if (!user.emailVerificationTimeout || DateTime.fromJSDate(user.emailVerificationTimeout) < DateTime.now()) {
        user = await createEmailVerificationUUID(user);
        createVerificationEmail(user);
      }

      return res.status(476).json({
        message: 'Your email has not been verified. Please check your email.'
      });
    }
    
    const jwtToken = jwt.sign({
      email: user.email,
      userId: user._id,
      roles: user.roles
    }, process.env.JWT_PRIV_KEY, {
      expiresIn: parseInt(process.env.AUTH_TOKEN_TIMEOUT)
      //expiresIn: '1h'
    });
    res.status(200).json({
      token: jwtToken,
      expiresIn: parseInt(process.env.AUTH_TOKEN_TIMEOUT),
      _id: user._id
    });
  }
  catch(err) {
    return res.status(401).json({
      message: err.message
    });
  }
});

auth.route('/verify').post(async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user.emailVerificationUUID === req.body.emailVerificationUUID ) {
      if (DateTime.fromJSDate(user.emailVerificationTimeout) > DateTime.now()){
        user.emailVerified = true;
        await user.save();
        return res.status(200).json({
          message: 'Email verified.'
        });
      }
      else {
        user = await createEmailVerificationUUID(user);
        createVerificationEmail(user);
        return res.status(477).json({
          message: 'Your email verification token expired.'
        });
      }
    }
  } catch(e) {
    return res.status(400).json({
      message: e.message
    });
  }
  return res.status(400).json({
    message: 'Something went wrong... please make sure you have entered the correct information.'
  });
});

auth.route('/sendpasswordreset').post(async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: 'The email you requested does not exist in our system.'
      });
    }
    user = await createPasswordResetUUID(user);
    createPasswordResetEmail(user);
    return res.status(200).json({
      message: 'Your password reset has been sent to your email.'
    });
    
  } catch(e) {
    return res.status(500).json({
      message: e.message
    });
  }
});

auth.route('/resetpassword').post(async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user.passwordResetUUID === req.body.uuid ) {
      if (DateTime.fromJSDate(user.passwordResetTimeout) > DateTime.now()) {
        if (req.body.newPassword === req.body.newPasswordConf) {
          const hash = await bcrypt.hash(req.body.newPassword, 10);
          user.password = hash;
          await user.save();
          return res.status(200).json({
            message: 'Password updated.'
          });
        } else {
          return res.status(476).json({
            message: 'Passwords did not match.'
          });
        }
      }
      else {
        user = await createPasswordResetUUID(user);
        createPasswordResetEmail(user);
        return res.status(477).json({
          message: 'Your password reset token expired.'
        });
      }
    } else {
      return res.status(400).json({
        message: 'Reset token incorrect. Please contact staff or check for a second email.'
      });
    }
  } catch(e) {
    return res.status(400).json({
      message: e.message
    });
  }
});

// Get Users
auth.route(['/', '/list']).get(authorize, (req, res, next) => {
  User.find((error, response) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json(response);
    }
  });
});

// Get Single User
auth.route('/read/:id').get(authorize, (req, res, next) => {
  User.findById(req.params.id, {}, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      });
    }
  });
});

// Get Single User
// eslint-disable-next-line @typescript-eslint/no-explicit-any
auth.route('/current').get(authorize, (req: any, res, next) => {
  if (!req.currentUserId) {
    res.status(404).json({
      msg: null
    });
  } else {
    User.findById(req.currentUserId, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data
        });
      }
    });
  }
});

// Get Current User
auth.route('/read/').get(authorize, (req, res, next) => {
  User.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      });
    }
  });
});

// Update User
auth.route('/update/:id').post(authorize, (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id, {
      $set: req.body
    },
    (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    }
  );
});

// Update User
auth.route('/update/password/:id').post([
  authorize,
  //password
  check('newPassword', 'Invalid password')
    .not()
    .isEmpty()
    .matches(PASSWORD_VALIDATION),
  //passwordConf
  check('newPassword', 'Passwords should match.')
    .if((value, {
      req
    }) => req.body.newPassword !== req.body.newPasswordConf)
], (req, res, next) => {
  User.findOne({
    _id: req.params.id
  }).then(user => {
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    bcrypt.compare(req.body.password, user.password).then((success) => {
      if (!success) {
        return res.status(401).json({
          message: 'Incorrect password'
        });
      }

      bcrypt.hash(req.body.newPassword, 10).then(hash => {
        user.password = hash;
        user.save();
        return res.status(200).json({
          message: 'Success'
        });
      });
    }, (failure) => {
      return res.status(401).json({
        message: 'Incorrect password'
      });
    });
  });
});

// Delete User
auth.route('/delete/:id').delete(authorize, (req, res, next) => {
  User.findByIdAndRemove(req.params.id, {}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      });
    }
  });
});