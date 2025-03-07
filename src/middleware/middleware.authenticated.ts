import express, { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
    let token: string;

    console.log('req.headers', req.headers);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('token', token);

            const decryptToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret);

            if (!decryptToken) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const dateNow = new Date();
            let presentDate = (dateNow.getTime() / 1000);

            console.log('presentDate', presentDate);

            // Token is valid → Call next()
            next();  
        } catch (error: any) {
            console.error(error);
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ error: 'The token is expired. Please log in again' });
            } else if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
                return res.status(401).json({ error: 'Invalid token' });
            }

            return res.status(500).json({ error: 'Server error. Please try again later' });
        }
    } else {
        return res.status(401).json({ error: 'Authorization header missing' });
    }
};