import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

import { HttpRetryService } from './../../../../projects/http-retry/src/public_api';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-docs-http-retry',
  templateUrl: './docs-http-retry.component.html'
})
export class DocsHttpRetryComponent implements OnInit {
  readonly httpRetryFailures: Observable<string[]>;

  constructor(private readonly httpClient: HttpClient, private readonly httpRetryService: HttpRetryService) {
    this.httpRetryFailures = this.httpRetryService.httpRetryFailures.pipe(
      scan<HttpErrorResponse, string[]>((messages, error) => [...messages, getErrorMessage(error)], [])
    );
  }

  ngOnInit() {
    if (environment.browser) {
      this.httpClient.get('/api/mock-error?errorStatusCode=503&maxErrorCount=15').subscribe();
    }
  }
}

function getErrorMessage(error: HttpErrorResponse) {
  return `Received HTTP ${error.status} from ${error.url}.`;
}
