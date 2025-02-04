import express, {Request, Response} from "express";
import { UserDocument } from "../interfaces/auth.interface";
import { signUp, login, addElements, logOut, resetPassword} from "../controllers/auth.controller";
import { authenthicated } from "../middleware/middleware.authenticated";
import { createProxyMiddleware } from 'http-proxy-middleware';
import http from 'http'
import { validate } from "../validators/validation";
import { loginSchema, signUpSchema } from "../validators/validationSchemas";
// import passport from '../config/googlePassport';
const router = express.Router();
// import passport from '../config/googlePassport'

router.get('/create', (req : Request, res : Response) => {
    console.log('the user is present');
    res.send("The user is created");
});
router.post('/register', validate(signUpSchema, "body"), signUp);
router.post('/login', validate(loginSchema, "body"), login);
router.post('/resetPassword', resetPassword);
router.post('/drive', authenthicated, addElements);
router.post('/logout', authenthicated, logOut);

export default router