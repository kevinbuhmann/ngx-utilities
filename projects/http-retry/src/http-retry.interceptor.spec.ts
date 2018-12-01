import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Injectable, Provider } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';

import { HTTP_REQUEST_RETRY_STRATEGIES } from './http-retry.di-tokens';
import { HttpRequestRetryStrategy } from './http-retry.helpers';
import { expectOneRequest } from './http-retry.helpers.spec';
import { httpRetryInterceptorProvider, requestAttemptNumberHeader } from './http-retry.interceptor';

@Injectable()
export class ServerUnavailableRetryStrategy implements HttpRequestRetryStrategy {
  // retry if the server is temporarily unavailable (e.g. for maintenance)
  readonly statuses = [502, 503];
  readonly maxCount = 10;

  delayFn() {
    return 0;
  }
}

export const serverUnavailableRetryStrategyProvider: Provider = {
  provide: HTTP_REQUEST_RETRY_STRATEGIES,
  useClass: ServerUnavailableRetryStrategy,
  multi: true
};

describe('HttpRetryInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [httpRetryInterceptorProvider, serverUnavailableRetryStrategyProvider]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should send the correct attempt number header', async(
    inject([HttpClient, HttpTestingController], async (httpClient: HttpClient, httpMock: HttpTestingController) => {
      httpClient.get('/api/people').subscribe();

      {
        const testRequest1 = await expectOneRequest(httpMock, '/api/people');
        expectRequestAttemptNumber(testRequest1).toBe('1');
        testRequest1.flush(null, { status: 502, statusText: 'Bad Gateway' });
      }

      {
        const testRequest2 = await expectOneRequest(httpMock, '/api/people');
        expectRequestAttemptNumber(testRequest2).toBe('2');
        testRequest2.flush(null, { status: 502, statusText: 'Bad Gateway' });
      }

      {
        const testRequest3 = await expectOneRequest(httpMock, '/api/people');
        expectRequestAttemptNumber(testRequest3).toBe('3');
        testRequest3.flush(null, { status: 502, statusText: 'Bad Gateway' });
      }

      {
        const testRequest4 = await expectOneRequest(httpMock, '/api/people');
        expectRequestAttemptNumber(testRequest4).toBe('4');
        testRequest4.flush(null, { status: 502, statusText: 'Bad Gateway' });
      }

      {
        const testRequest5 = await expectOneRequest(httpMock, '/api/people');
        expectRequestAttemptNumber(testRequest5).toBe('5');
        testRequest5.flush(null, { status: 200, statusText: 'OK' });
      }
    })
  ));

  it('should do nothing for non-GET requests', async(
    inject([HttpClient, HttpTestingController], async (httpClient: HttpClient, httpMock: HttpTestingController) => {
      httpClient.post('/api/people', '').subscribe();

      const testRequest = await expectOneRequest(httpMock, '/api/people');
      expectRequestAttemptNumber(testRequest).toBeNull();

      // the verification in afterEach will ensure that no retries were made
    })
  ));
});

function expectRequestAttemptNumber(testRequest: TestRequest) {
  return expect(testRequest.request.headers.get(requestAttemptNumberHeader));
}
