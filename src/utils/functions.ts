
import crypto from "crypto";
import { algorithm, iv, secretKey } from "./variables";
import handlebars from 'handlebars';
import fs from 'fs'
import { HttpCode } from "constant";
import { Response, Request } from "express"




export const cryptoEncrypt = (text: string) => {
  console.log('algorithm', algorithm, typeof algorithm)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex"); // Store IV with encrypted text
};

export const readTemplate = (templatePath: string, data: []) => {
  const source = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(source);
  return template(data);
};

export const getCategory = (word: string, eleIndex: string) => {
  let categoryList = word.split(" -> ");
  let category = eleIndex === "first" ? categoryList[0] : categoryList[categoryList.length - 1];
  return category;
}

export const handleErrorResponse = (res: Response, error: unknown, statusCode: number, message?: string) => {
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
  res.status(statusCode).json({ failure: true, error: !message ? errorMessage : message });
};