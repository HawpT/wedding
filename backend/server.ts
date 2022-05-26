/*
 * To install MongoDB on the server, see https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
 */
import express from 'express';
import { join } from 'path';
import { connect, set } from 'mongoose';
import cors from 'cors';
import { urlencoded } from 'body-parser';
import rsvpRoute from './routes/rsvp.route';
import authRotue from './routes/auth.route';
import roleRoute from './routes/role.route';
import testRoute from './routes/test.route';
import dataRoute from './routes/data.route';
import { processAndSendEmailsJob, testVerificationEmail } from './services/email.service';
import dotenv from 'dotenv';
import registrationCodeRoute from './routes/registration-code';

dotenv.config({ path: '.env' });

connect( process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  promiseLibrary: global.Promise
}).then(() => {
  console.log('Database sucessfully connected');
  //console.log('Starting email processing daemon');
  
  // testVerificationEmail();
  // processAndSendEmailsJob.start();
},
error => {
  console.log('Database could not connected: ' + error);
});

// Remove MongoDB warning error
set('useCreateIndex', true);

//Remove deprecation error for findOneAndUpdate()
set('useFindAndModify', false);

// Setting up port with express js

const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({
  extended: false
}));

app.use('/api/rsvp', rsvpRoute);
app.use('/api/user', authRotue);
app.use('/api/role', roleRoute);
app.use('/api/test', testRoute);
app.use('/api/data', dataRoute);
app.use('/api/registration-code', registrationCodeRoute);

const staticDir = join(__dirname, process.env.STATIC_DIR);

app.use(express.static(staticDir));

app.get('*', (req, res, next) => {
  res.sendFile(join(staticDir, 'index.html'), {
    root: __dirname
  });
});

// Create port
const port = process.env.PORT || 4001;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port);
});


// Express error handling
app.use((req, res, next) => {
  setImmediate(() => {
    next(new Error('Something went wrong'));
  });
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});