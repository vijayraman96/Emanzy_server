import { Document } from "mongoose";

export enum Gender {
    Male = 'Male',
    Female = "Female",
    Others = "Others",
    Anonymous = 'Anonymous'
}
export enum Relation {
    Parents = "Parents",
    Husband = "Husband",
    Wife = "Wife",
    Kids = "Kids",
    Brother = "Brother",
    Sister = "Sister",
    Anonymous = 'Anonymous'
}

export interface FamilyNumber {
    name: string,
    age?: number,
    gender?: Gender,
    address?: string,
    relation: Relation,
    mobile?: number
}
export enum countryCode {
    ind = "INDIA",
    usa = "UNITED STATES OF AMERICA",
    uk = "UNITED KINGDOM",
    DE = "GERMANY"
}
export enum userRole {
    Admin = 'Admin',
    Manager = 'Manager',
    Supervisor = 'Supervisor',
    Submanager = 'Submanager',
    Staff = 'Staff',
    User = 'User'
}

export interface securityToken {
    signup_token?: string,
    otp_token?: string,
    signup_token_created?: Date,
    crypto_token?: string,
    iv_token?: string,
    otp_token_created?: Date
}
export type UserDocument= Document & {
    userName: string,
    email?: string,
    googleId?: string,
    facebookId?: string,
    twitterId?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    dob?: Date,
    age?: number,
    gender?: Gender,
    interest?: string[],
    mobile?: string,
    nickName?: string,
    address?: string[],
    family?: FamilyNumber[],
    countryCode?: countryCode,
    role?: userRole,
    forgotPasswordToken?: string,
    deviceId?: string[],
    multipleDevicesAllow?: boolean,
    signupSecurity?: securityToken[]
}

