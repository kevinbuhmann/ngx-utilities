import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { delay, retryWhen, switchMap } from 'rxjs/operators';

import { httpRetryFailuresSubject } from './ngx-http-retry.service';

export interface HttpRequestRetryStrategy {
  statuses: number[];
  maxCount: number;
  delayFn?(retryNumber: number): number;
  onFailure?(error: HttpErrorResponse): void;
}

export function httpRequestRetry(retryStrategies: HttpRequestRetryStrategy[]) {
  const counts: { [retryStrategyIndex: number]: number } = {};

  function retryWhenNotifier(errors: Observable<any>) {
    return errors.pipe(
      switchMap(error => {
        if (error instanceof HttpErrorResponse) {
          const retryStrategyIndex = retryStrategies.findIndex(rs => rs.statuses.includes(error.status));
          const retryStrategy = retryStrategyIndex > -1 ? retryStrategies[retryStrategyIndex] : undefined;

          counts[retryStrategyIndex] = (counts[retryStrategyIndex] || 0) + 1;

          const shouldRetry = retryStrategy && counts[retryStrategyIndex] < retryStrategy.maxCount;
          const retryDelay = retryStrategy && retryStrategy.delayFn ? retryStrategy.delayFn(counts[retryStrategyIndex]) : 0;

          if (!shouldRetry && retryStrategy) {
            httpRetryFailuresSubject.next(error);

            if (retryStrategy.onFailure) {
              retryStrategy.onFailure(error);
            }
          }

          return shouldRetry ? of(error).pipe(delay(retryDelay)) : _throw(error);
        }
      })
    );
  }

  return <T>(source: Observable<T>) => source.pipe(retryWhen(retryWhenNotifier));
}
