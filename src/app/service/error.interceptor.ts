import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { ApiService } from "@service/api.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.error && err.error.message) 
          err.message = err.error.message; //use our server messages

        if ([401, 403].indexOf(err.status) >= 0) {
          //TODO error page handling
          if (err.status === 401 && err.message && (
            err.message.indexOf('Your session has expired') >= 0 || err.message.indexOf('jwt expired') >= 0 )) {
            location.replace('/login');
          } 
        }

        return throwError(err);
      })
    );
  }
}
