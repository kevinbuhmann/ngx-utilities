# ngx-http-retry

[![npm version](https://badge.fury.io/js/ngx-http-retry.svg)](https://badge.fury.io/js/ngx-http-retry)

A configurable Angular HTTP interceptor to retry GET requests and respond to errors and flaky
connections.

## Installation

To install this library, run:

`npm install ngx-http-retry --save` -or- `yarn add ngx-http-retry`

and then import and configure it in your Angular `AppModule`:

```typescript
import { NgxHttpRetryModule } from 'ngx-http-retry';

@NgModule({
  imports: [
    NgxHttpRetryModule.forRoot()
  ],
  providers: [serverUnavailableRetryStrategyProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

## Usage

You configure `ngx-http-retry` by providing (via Angular dependency injection) a collection of
injectable classes that implement the `HttpRequestRetryStrategy` interface. These "retry strategies"
tell `ngx-http-retry` which status codes to retry, how many times to retry, and when to stop
retrying.

In addition to being thrown by the http request observable like normal, the last `HttpErrorResponse`
received when `ngx-http-retry` stops retrying a request is passed to the retry strategy's `onFailure`
method and emitted on the `NgxHttpRetryService`'s `httpRetryFailures` observable.

### Implementing `HttpRequestRetryStrategy`

```typescript
import { HttpRequestRetryStrategy } from 'ngx-http-retry';

@Injectable()
export class ServerUnavailableRetryStrategy implements HttpRequestRetryStrategy {
  readonly statuses = [503];
  readonly maxCount = 10;

  delayFn() {
    return 100;
  }

  onFailure(error: HttpErrorResponse) {
    console.log('When ngx-http-retry stops retrying a request, the final error is passed back to the retry strategy.', error.status, error.url);
  }
}

export const serverUnavailableRetryStrategyProvider: Provider = {
  provide: HTTP_REQUEST_RETRY_STRATEGIES,
  useClass: ServerUnavailableRetryStrategy,
  multi: true
};
```

### Using `NgxHttpRetryService` (optional)

```typescript
import { NgxHttpRetryService } from 'ngx-http-retry';

export class MyComponent implements OnInit {
  constructor(private readonly ngxHttpRetryService: NgxHttpRetryService) { }

  ngOnInit() {
    this.ngxHttpRetryService.httpRetryFailures.subscribe(error => {
      console.log('You can also listen to errors from all retry strategies in one place.', error.status, error.url);
    });
  }
}
```

### Request Headers

`ngx-http-retry` will add a header named `X-Request-Attempt-Number` to each request it sends that
with the number of the current attempt. This was added primarily for testing. But it's plausible
that this could be useful information to track on the server in some scenarios, so this header is
added in production. A future version may allow disabling this option if needed.

## License

MIT © [Kevin Phelps](https://kevinphelps.me)