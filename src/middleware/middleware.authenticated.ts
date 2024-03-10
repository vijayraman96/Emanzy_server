import express, { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

export const authenthicated = (req: Request, res: Response, next: NextFunction) => {
    let token: string;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('token', token);

            const decryptToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret, (err) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        res.status(401).json({ error: 'The token is expired. Please log in again' });
                    } else if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
                        res.status(401).json({ error: 'Invalid token' });
                    }
                } else {
                    var dateNow = new Date();
                    console.log('dateNow', dateNow.getTime());
                    let presentDate = (dateNow.getTime() / 1000);
                    console.log('presentDate', presentDate);
                    next();
                }
            });

        } catch (error) {
            console.log(error, 'error');
            res.status(401).json({ error: 'The server error.Please try again later' });
        }
    }
}