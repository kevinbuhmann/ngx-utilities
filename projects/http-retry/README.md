# http-retry

[![npm version](https://badge.fury.io/js/%40ngx-utilities%2Fhttp-retry.svg)](https://www.npmjs.com/package/@ngx-utilities/http-retry)

A configurable Angular HTTP interceptor to retry GET requests and respond to errors and flaky
connections.

## Installation

To install this library, run:

`npm install @ngx-utilities/http-retry --save` -or- `yarn add @ngx-utilities/http-retry`

and then import `HttpRetryModule` it in your Angular `AppModule`:

```typescript
// app.module.ts

import { HttpRetryModule } from '@ngx-utilities/http-retry';

@NgModule({
  imports: [
    HttpRetryModule.forRoot()
  ],
  providers: [
    networkErrorRetryStrategyProvider,
    serverUnavailableRetryStrategyProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

## Usage

You configure `http-retry` by providing (via Angular dependency injection) a collection of
injectable classes that implement the `HttpRequestRetryStrategy` interface. These "retry strategies"
tell `http-retry` which status codes to retry, how many times to retry, and when to stop
retrying. The global HTTP interceptor provided by `HttpRetryModule` will do nothing if you do not
provide any retry strategies.

In addition to being thrown by the http request observable like normal, the last `HttpErrorResponse`
received when `http-retry` stops retrying a request is passed to the retry strategy's `onFailure`
method and emitted on the `HttpRetryService`'s `httpRetryFailures` observable.

### Implementing `HttpRequestRetryStrategy`

```typescript
// network-error.retry-strategy.ts

import { HttpRequestRetryStrategy } from '@ngx-utilities/http-retry';

@Injectable()
import { Injectable, Provider } from '@angular/core';
import { HttpRequestRetryStrategy, HTTP_REQUEST_RETRY_STRATEGIES } from '@ngx-utilities/http-retry';

import { NetworkStatusService } from './../services/network-status.service';

@Injectable()
export class NetworkErrorRetryStrategy implements HttpRequestRetryStrategy {
  // status code 0 means there was a network error (e.g. a timeout)
  readonly statuses = [0];
  readonly maxCount = 3;

  delayFn(retryNumber: number) {
    // retry immediately, wait 3 seconds and try again, and then stop due the max count
    return retryNumber === 1 ? 0 : 3000;
  }

  onFailure(error: HttpErrorResponse) {
    console.log('network error', error.status, error.url);
  }
}

export const networkErrorRetryStrategyProvider: Provider = {
  provide: HTTP_REQUEST_RETRY_STRATEGIES,
  useClass: NetworkErrorRetryStrategy,
  multi: true
};
```

```typescript
// server-unavailable.retry-strategy.ts

@Injectable()
export class ServerUnavailableRetryStrategy implements HttpRequestRetryStrategy {
  // retry if the server is temporarily unavailable (e.g. for maintenance)
  readonly statuses = [502, 503];
  readonly maxCount = 10;

  delayFn() {
    return 3000;
  }

  onFailure(error: HttpErrorResponse) {
    console.log('server unavailable error', error.status, error.url);
  }
}

export const serverUnavailableRetryStrategyProvider: Provider = {
  provide: HTTP_REQUEST_RETRY_STRATEGIES,
  useClass: ServerUnavailableRetryStrategy,
  multi: true
};
```

### Using `HttpRetryService` (optional)

```typescript
// my.component.ts

import { HttpRetryService } from '@ngx-utilities/http-retry';

export class MyComponent implements OnInit {
  constructor(private readonly httpRetryService: HttpRetryService) { }

  ngOnInit() {
    this.httpRetryService.httpRetryFailures.subscribe(error => {
      console.log('global http retry error listener', error.status, error.url);
    });
  }
}
```

### RxJS Operator

The core functionality of this library is exposed as a RxJS operator that takes an an array of
retry strategies which can be instances of classes or plain objects that implement the
`HttpRequestRetryStrategy` interface. You can use this operator directly if you do not wish to use
the global interceptor provided by `HttpRetryModule`.

```typescript
import { httpRequestRetry } from '@ngx-utilities/http-retry';

export class MyComponent implements OnInit {
  constructor(private readonly httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get('/some/url').pipe(httpRequestRetry(retryStrategies)).subscribe();
  }
}
```

### Request Headers

`http-retry` will add a header named `X-Request-Attempt-Number` to each request it sends that
with the number of the current attempt. This was added primarily for testing. But it's plausible
that this could be useful information to track on the server in some scenarios, so this header is
added in production. A future version may allow disabling this option if needed.

## License

MIT © [Kevin Phelps](https://kevinphelps.me)
