"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRole = exports.countryCode = exports.Relation = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Others"] = "Others";
    Gender["Anonymous"] = "Anonymous";
})(Gender || (exports.Gender = Gender = {}));
var Relation;
(function (Relation) {
    Relation["Parents"] = "Parents";
    Relation["Husband"] = "Husband";
    Relation["Wife"] = "Wife";
    Relation["Kids"] = "Kids";
    Relation["Brother"] = "Brother";
    Relation["Sister"] = "Sister";
    Relation["Anonymous"] = "Anonymous";
})(Relation || (exports.Relation = Relation = {}));
var countryCode;
(function (countryCode) {
    countryCode["ind"] = "INDIA";
    countryCode["usa"] = "UNITED STATES OF AMERICA";
    countryCode["uk"] = "UNITED KINGDOM";
    countryCode["DE"] = "GERMANY";
})(countryCode || (exports.countryCode = countryCode = {}));
var userRole;
(function (userRole) {
    userRole["Admin"] = "Admin";
    userRole["Manager"] = "Manager";
    userRole["Supervisor"] = "Supervisor";
    userRole["Submanager"] = "Submanager";
    userRole["Staff"] = "Staff";
    userRole["User"] = "Sser";
})(userRole || (exports.userRole = userRole = {}));
