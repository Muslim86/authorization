import {
    CallHandler,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
} from "@nestjs/common";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";


@Injectable()
export class InternalServerErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle()
            .pipe(catchError(error => {
                console.log(error)
                if (error instanceof InternalServerErrorException) {
                    throw new InternalServerErrorException(error.message);
                } else {
                    throw error;
                }
            }));
    }
}