import { Request } from 'express';
import { JwtUserPayload } from './jwt-payload.interface';

export interface RequestWithUser extends Request {
  jwt?: JwtUserPayload;
}
