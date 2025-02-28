// Auth middleware to validate JWT signature from the request header and request generating from CB.

import express from 'express';
import jwt from 'jsonwebtoken';
import { Error401Exception } from '../exceptions/http.exception';
import moment from 'moment';

interface AuthenticationTokenPayload {
  url: string;
  body: string;
  iss: string;
  exp: number;
}

async function internalAuthMiddleware(
  request: express.Request,
  _response: express.Response,
  next: express.NextFunction
): Promise<void> {
  const internalToken =
    request.headers['X-INOVE-SIGNATURE'] ||
    request.headers['X-INOVE-SIGNATURE'.toLowerCase()];
  if (internalToken && typeof internalToken === 'string') {
    //const secret = process.env.INOVE_SIGNATURE_SECRET || '';
    const secret = '0a4679d1-5db7-418e-9fc9-6782bd5c60e1'
    try {
      if (secret === internalToken) {
        // Success
        next();
      } else {
        // Throw exception
        next(new Error401Exception(internalToken, secret));
      }
    } catch (error) {
      // Throw exception
      next(new Error401Exception(internalToken, secret));
    }
  } else {
    // Throw exception
    next(new Error401Exception('No internal token found', ''));
  }
}

export default internalAuthMiddleware;