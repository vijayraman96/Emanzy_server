import mongoose, { Schema } from "mongoose";
import { UserDocument, Gender, Relation , FamilyNumber, countryCode, userRole } from "../interfaces/auth.interface";

const FamilyNumberSchema = new Schema<FamilyNumber>({
    name: {type: String},
    age: {type: Number},
    gender: {type: String, enum: Object.values(Gender)},
    address: {type: String},
    relation: {type: String, enum: Object.values(Relation)},
    mobile: {type: Number}
})

const userSchema = new Schema<UserDocument>(
    {
    userName: {type: String, required: true},
    email: {type: String},
    googleId: {type: String},
    facebookId: {type: String},
    twitterId: {type: String},
    password: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    dob: {type: Date },
    age: {type: Number},
    gender: {type: String, enum: Object.values(Gender)},
    interest: {type: [String]},
    mobile: {type: String},
    nickName: {type: String},
    address: {type: [String]},
    family: {type: [FamilyNumberSchema]},
    countryCode: {type: String, enum: Object.values(countryCode)},
    role: {type: String, enum: Object.values(userRole), default: userRole.User}
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;