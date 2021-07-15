import { Injectable, NestMiddleware } from "@nestjs/common"
import { NextFunction } from "express";

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...' + req.method);
    next();
  } 
}
