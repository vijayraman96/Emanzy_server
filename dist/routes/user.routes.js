"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const middleware_authenticated_1 = require("../middleware/middleware.authenticated");
// import passport from '../config/googlePassport';
const router = express_1.default.Router();
// import passport from '../config/googlePassport'
router.get('/create', (req, res) => {
    console.log('the user is present');
    res.send("The user is created");
});
router.post('/register', auth_controller_1.signUp);
router.post('/login', auth_controller_1.login);
router.post('/resetPassword', auth_controller_1.resetPassword);
router.post('/drive', middleware_authenticated_1.authenthicated, auth_controller_1.addElements);
router.post('/logout', middleware_authenticated_1.authenthicated, auth_controller_1.logOut);
exports.default = router;
