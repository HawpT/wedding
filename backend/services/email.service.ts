/* eslint-disable @typescript-eslint/no-unused-vars */
import Email, { IEmail } from '../models/email';
import User, { IUser } from '../models/user';
import cron from 'node-cron';
import { createEmailVerificationUUID } from '../routes/auth.route';

export function createEmail(user: IUser, subject: string, body: string, link: string): void {
  const newEmail = {
    email: user.email,
    nameFirst: user.nameFirst,
    nameLast: user.nameLast,
    subject: subject,
    body: body,
    link: link
  };
  Email.create(newEmail, (error, data) => {
    if (error) {
      return error;
    } else {
      'Email created.';
    }
  });
}

export function createVerificationEmail(user: IUser): void {
  createEmail(user, 
    'Kevin and McKenna Email Confirmation', 
    'Please click the link below to verify your email address.', 
    `https://kevinandmckenna.com/user/verify?email=${user.email}&uuid=${user.emailVerificationUUID}`);
}

export function createPasswordResetEmail(user: IUser): void {
  createEmail(user, 
    'Kevin and McKenna Password Reset', 
    'Please click the link below to change your password.', 
    `https://kevinandmckenna.com/password-reset?email=${user.email}&uuid=${user.passwordResetUUID}`);
}

export function processAndSendEmails(): void {
  Email.find({
    sent: false
  }, (error, emails) => {
    if (error) {
      console.log(error);
    }
    if (!emails) return;
    for (let i = 0; i < emails.length; ++i) {
      //send less than 14 emails per second
      const timeoutTime = 100 * i;
      setTimeout(function () {
        sendEmail(emails[i]);
      }, timeoutTime);
    }
  });
}

const schedule = '*/15 * * * * *';
if(!cron.validate(schedule)) 
  throw new Error('invalid cron schedule');

export const processAndSendEmailsJob: cron.ScheduledTask = 
  cron.schedule(schedule, processAndSendEmails, {
    scheduled: false
  });

export async function sendEmail(email: IEmail): Promise<boolean> {
  try {

    email.sent = true;
    await email.save();
    return true;
  } catch(e) {
    return false;
  }
}

export async function testVerificationEmail(): Promise<void> {
  let user = await User.findOne({
    email: 'kshaupty@gmail.com'
  });
  user = await createEmailVerificationUUID(user);
  await createVerificationEmail(user);
}