"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenthicated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenthicated = (req, res, next) => {
    let token;
    console.log('req.headers', req.headers);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('token', token);
            const decryptToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        res.status(401).json({ error: 'The token is expired. Please log in again' });
                    }
                    else if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
                        res.status(401).json({ error: 'Invalid token' });
                    }
                }
                else {
                    var dateNow = new Date();
                    console.log('dateNow', dateNow.getTime());
                    let presentDate = (dateNow.getTime() / 1000);
                    console.log('presentDate', presentDate);
                    res.json({ success: token });
                    next();
                }
            });
        }
        catch (error) {
            console.log(error, 'error');
            res.status(401).json({ error: 'The server error.Please try again later' });
        }
    }
    else {
        res.status(401).json({ error: 'The server error.Please try again later' });
    }
};
exports.authenthicated = authenthicated;
