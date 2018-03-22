import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HttpErrorResponse } from '@angular/common/http';

export const httpRetryFailuresSubject = new Subject<HttpErrorResponse>();

@Injectable()
export class NgxHttpRetryService {
  readonly httpRetryFailures: Observable<HttpErrorResponse>;

  constructor() {
    this.httpRetryFailures = httpRetryFailuresSubject.asObservable();
  }
}
