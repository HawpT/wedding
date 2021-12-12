export class User {
    _id: string;
    nameFirst: string;
    nameLast: string;
    email: string;
    emailVerified: boolean;
    emailVerificationTimeout: Date;
    emailVerificationUUID: string;
    passwordResetTimeout: Date;
    passwordResetUUID: string;

    password: string;

    roles: [String];
    createdAt: Date;
    updatedAt: Date;
}