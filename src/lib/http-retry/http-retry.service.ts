import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export const httpRetryFailuresSubject = new Subject<HttpErrorResponse>();

@Injectable()
export class HttpRetryService {
  readonly httpRetryFailures: Observable<HttpErrorResponse>;

  constructor() {
    this.httpRetryFailures = httpRetryFailuresSubject.asObservable();
  }
}
