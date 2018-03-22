import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { scan } from 'rxjs/operators';
import { SubscriptionTrackerBaseComponent } from 'subscription-tracker';

import { NgxHttpRetryService } from './../../../lib/ngx-http-retry/public_api';

@Component({
  selector: 'app-docs-ngx-http-retry',
  templateUrl: './docs-ngx-http-retry.component.html'
})
export class DocsNgxHttpRetryComponent extends SubscriptionTrackerBaseComponent implements OnInit {
  readonly httpRetryFailures: Observable<string[]>;

  constructor(private readonly httpClient: HttpClient, private readonly ngxHttpRetryService: NgxHttpRetryService) {
    super();

    this.httpRetryFailures = this.ngxHttpRetryService.httpRetryFailures.pipe(
      scan<HttpErrorResponse, string[]>((messages, error) => [...messages, getErrorMessage(error)], [])
    );
  }

  ngOnInit() {
    this.httpClient.get('/api/mock-error?errorStatusCode=503&maxErrorCount=15').subscribeAndTrack(this);
  }
}

function getErrorMessage(error: HttpErrorResponse) {
  return `Received HTTP ${error.status} from ${error.url}.`;
}
