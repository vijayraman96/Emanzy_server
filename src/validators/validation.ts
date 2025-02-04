import { Request, Response, NextFunction } from 'express';
import Joi, { Schema, ValidationError } from 'joi';


type DataType = "body" | "query" | "params"
export const validate = (Schema: Schema, type: DataType = "body") => {
    return (req: Request, res: Response, next: NextFunction) => {
        let data: any;

        switch(type) {
            case "body" : 
            data = req.body;
            break;
            case "query" : 
            data = req.query;
            break;
            case "params" : 
            data = req.params;
            break;
            default: 
            return res.status(400).json({error: "Invalid type"})
        }

        const { value, error } = Schema.validate(data);
        if (error) {
            // If validation fails, return a 400 response with the error message
            return res.status(400).json({
              error: error.details[0].message,
            });
          }
          req.validatedData = value;
    next();
    }
}