
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      validatedData?: any;  // Custom property for validated data
    }
  }
}

import 'express-session'

declare module 'express-session' {
    interface SessionData {
        token: string
    }
}

