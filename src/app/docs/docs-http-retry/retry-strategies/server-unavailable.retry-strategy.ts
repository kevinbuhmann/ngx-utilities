import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';

import { HttpRequestRetryStrategy, HTTP_REQUEST_RETRY_STRATEGIES } from './../../../../../projects/http-retry/public_api';

@Injectable()
export class ServerUnavailableRetryStrategy implements HttpRequestRetryStrategy {
  readonly statuses = [503];
  readonly maxCount = 3;

  delayFn() {
    return 1000;
  }

  onFailure(error: HttpErrorResponse) {
    console.log('When http-retry stops retrying, the final error is passed back to retry strategy...', error.status, error.url);
  }
}

export const serverUnavailableRetryStrategyProvider: Provider = {
  provide: HTTP_REQUEST_RETRY_STRATEGIES,
  useClass: ServerUnavailableRetryStrategy,
  multi: true
};
