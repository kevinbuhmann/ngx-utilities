import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';

import { httpRequestRetry, HttpRequestRetryStrategy } from './http-retry.helpers';

describe('httpRequestRetry', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should retry the request', async(
    inject([HttpClient, HttpTestingController], async (httpClient: HttpClient, httpMock: HttpTestingController) => {
      const retryStrategy: HttpRequestRetryStrategy = {
        statuses: [502],
        maxCount: 5
      };

      httpClient
        .get('/api/people')
        .pipe(httpRequestRetry([retryStrategy]))
        .subscribe();

      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 200, statusText: 'OK' });
    })
  ));

  it('should retry the request up to the max allowed number of times', async(
    inject([HttpClient, HttpTestingController], async (httpClient: HttpClient, httpMock: HttpTestingController) => {
      const onFailureSpy = jasmine.createSpy('onFailure');

      const retryStrategy: HttpRequestRetryStrategy = {
        statuses: [502],
        maxCount: 5,
        delayFn: () => 0,
        onFailure: onFailureSpy
      };

      httpClient
        .get('/api/people')
        .pipe(httpRequestRetry([retryStrategy]))
        .subscribe();

      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 200, statusText: 'OK' });

      expect(onFailureSpy).not.toHaveBeenCalled();
    })
  ));

  it('should retry the request up to the max allowed number of times and stop even if there is an error', async(
    inject([HttpClient, HttpTestingController], async (httpClient: HttpClient, httpMock: HttpTestingController) => {
      const onFailureSpy = jasmine.createSpy('onFailure');

      const retryStrategy: HttpRequestRetryStrategy = {
        statuses: [502],
        maxCount: 5,
        delayFn: () => 0,
        onFailure: onFailureSpy
      };

      httpClient
        .get('/api/people')
        .pipe(httpRequestRetry([retryStrategy]))
        .subscribe(undefined, error => {
          expect(error.status).toBe(502);
        });

      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });

      expect(onFailureSpy).toHaveBeenCalled();
    })
  ));

  it('should retry with multiple error statuses in the same retry strategy', async(
    inject([HttpClient, HttpTestingController], async (httpClient: HttpClient, httpMock: HttpTestingController) => {
      const retryStrategy: HttpRequestRetryStrategy = {
        statuses: [502, 503],
        maxCount: 5,
        delayFn: () => 0
      };

      httpClient
        .get('/api/people')
        .pipe(httpRequestRetry([retryStrategy]))
        .subscribe();

      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 503, statusText: 'Service Unavailable' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 503, statusText: 'Service Unavailable' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 200, statusText: 'OK' });
    })
  ));

  it('should retry with multiple retry strategies', async(
    inject([HttpClient, HttpTestingController], async (httpClient: HttpClient, httpMock: HttpTestingController) => {
      const retryStrategy1: HttpRequestRetryStrategy = {
        statuses: [502, 503],
        maxCount: 5,
        delayFn: () => 0
      };

      const retryStrategy2: HttpRequestRetryStrategy = {
        statuses: [0],
        maxCount: 3,
        delayFn: () => 0
      };

      httpClient
        .get('/api/people')
        .pipe(httpRequestRetry([retryStrategy1, retryStrategy2]))
        .subscribe();

      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 503, statusText: 'Service Unavailable' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 0, statusText: 'Network Error' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 503, statusText: 'Service Unavailable' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 0, statusText: 'Network Error' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 200, statusText: 'OK' });
    })
  ));

  it('should retry with multiple retry strategies and stop on the first error that exceeds the max allowed count', async(
    inject([HttpClient, HttpTestingController], async (httpClient: HttpClient, httpMock: HttpTestingController) => {
      const retryStrategy1: HttpRequestRetryStrategy = {
        statuses: [502, 503],
        maxCount: 5,
        delayFn: () => 0
      };

      const retryStrategy2: HttpRequestRetryStrategy = {
        statuses: [0],
        maxCount: 3,
        delayFn: () => 0
      };

      httpClient
        .get('/api/people')
        .pipe(httpRequestRetry([retryStrategy1, retryStrategy2]))
        .subscribe(undefined, error => {
          expect(error.status).toBe(0);
        });

      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 0, statusText: 'Network Error' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 503, statusText: 'Service Unavailable' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 0, statusText: 'Network Error' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 0, statusText: 'Network Error' });
    })
  ));

  it('should stop retrying immediately if the error status does not match a retry strategy', async(
    inject([HttpClient, HttpTestingController], async (httpClient: HttpClient, httpMock: HttpTestingController) => {
      const retryStrategy1: HttpRequestRetryStrategy = {
        statuses: [502, 503],
        maxCount: 5,
        delayFn: () => 0
      };

      const retryStrategy2: HttpRequestRetryStrategy = {
        statuses: [0],
        maxCount: 3,
        delayFn: () => 0
      };

      httpClient
        .get('/api/people')
        .pipe(httpRequestRetry([retryStrategy1, retryStrategy2]))
        .subscribe(undefined, error => {
          expect(error.status).toBe(500);
        });

      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 502, statusText: 'Bad Gateway' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 503, statusText: 'Service Unavailable' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 0, statusText: 'Network Error' });
      (await expectOneRequest(httpMock, '/api/people')).flush(null, { status: 500, statusText: 'Internal Server Error' });
    })
  ));
});

export function expectOneRequest(httpMock: HttpTestingController, url: string) {
  return new Promise<TestRequest>(resolve => {
    setTimeout(() => {
      expect(true).toBe(true); // prevent "SPEC HAS NO EXPECTATIONS" message
      resolve(httpMock.expectOne(url));
    }, 0);
  });
}
