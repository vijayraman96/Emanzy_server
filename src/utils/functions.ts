
import crypto from "crypto";
import { algorithm, iv, secretKey } from "./variables";
import handlebars from 'handlebars';
import fs from 'fs'




export  const cryptoEncrypt = (text:string) => {
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