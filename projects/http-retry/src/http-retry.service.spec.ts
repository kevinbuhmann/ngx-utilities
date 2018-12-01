import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';

import { httpRetryFailuresSubject, HttpRetryService } from './http-retry.service';

describe('HttpRetryService', () => {
  it('should emit any retry failures', async () => {
    const httpRetryService = new HttpRetryService();

    let emittedHttpErrorResponse: HttpErrorResponse;
    httpRetryService.httpRetryFailures.pipe(first()).subscribe(httpErrorResponse => {
      emittedHttpErrorResponse = httpErrorResponse;
    });

    const receivedHttpErrorResponse = new HttpErrorResponse({});
    httpRetryFailuresSubject.next(receivedHttpErrorResponse);

    expect(emittedHttpErrorResponse).toBe(receivedHttpErrorResponse);
  });
});
