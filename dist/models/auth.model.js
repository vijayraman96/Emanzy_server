"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const auth_interface_1 = require("../interfaces/auth.interface");
const FamilyNumberSchema = new mongoose_1.Schema({
    name: { type: String },
    age: { type: Number },
    gender: { type: String, enum: Object.values(auth_interface_1.Gender) },
    address: { type: String },
    relation: { type: String, enum: Object.values(auth_interface_1.Relation) },
    mobile: { type: Number }
});
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    email: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    twitterId: { type: String },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    dob: { type: Date },
    age: { type: Number },
    gender: { type: String, enum: Object.values(auth_interface_1.Gender) },
    interest: { type: [String] },
    mobile: { type: String },
    nickName: { type: String },
    address: { type: [String] },
    family: { type: [FamilyNumberSchema] },
    countryCode: { type: String, enum: Object.values(auth_interface_1.countryCode) },
    role: { type: String, enum: Object.values(auth_interface_1.userRole), default: auth_interface_1.userRole.User }
});
const UserModel = mongoose_1.default.model('User', userSchema);
exports.default = UserModel;
