import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Inject, Injectable, Provider } from '@angular/core';
import { of, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { HTTP_REQUEST_RETRY_STRATEGIES } from './http-retry.di-tokens';
import { httpRequestRetry, HttpRequestRetryStrategy } from './http-retry.helpers';

export const requestAttemptNumberHeader = 'X-Request-Attempt-Number';

@Injectable()
export class HttpRetryInterceptor implements HttpInterceptor {
  constructor(@Inject(HTTP_REQUEST_RETRY_STRATEGIES) private httpRequestRetryStrategies: HttpRequestRetryStrategy[]) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let result: Observable<HttpEvent<any>>;

    if (this.httpRequestRetryStrategies.length && request.method.toUpperCase() === 'GET') {
      let attemptNumber = 0;

      result = of(undefined).pipe(
        tap(() => {
          attemptNumber++;
        }),
        switchMap(() => next.handle(getRequestWithAttemptNumber(request, attemptNumber))),
        httpRequestRetry(this.httpRequestRetryStrategies)
      );
    } else {
      result = next.handle(request);
    }

    return result;
  }
}

export const httpRetryInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpRetryInterceptor,
  multi: true
};

function getRequestWithAttemptNumber(request: HttpRequest<any>, attemptNumber: number) {
  return request.clone({ headers: request.headers.append(requestAttemptNumberHeader, attemptNumber.toString()) });
}
