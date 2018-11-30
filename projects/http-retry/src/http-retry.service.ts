import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const httpRetryFailuresSubject = new Subject<HttpErrorResponse>();

@Injectable({ providedIn: 'root' })
export class HttpRetryService {
  readonly httpRetryFailures: Observable<HttpErrorResponse>;

  constructor() {
    this.httpRetryFailures = httpRetryFailuresSubject.asObservable();
  }
}
