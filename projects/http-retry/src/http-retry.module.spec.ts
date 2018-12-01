import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HTTP_REQUEST_RETRY_STRATEGIES } from './http-retry.di-tokens';
import { HttpRetryInterceptor } from './http-retry.interceptor';
import { HttpRetryModule } from './http-retry.module';

const fakeRetryStrategyProvider: Provider = {
  provide: HTTP_REQUEST_RETRY_STRATEGIES,
  useValue: 'Fake strategy',
  multi: true
};

describe('HttpRetryModule', () => {
  it('should provide the http retry interceptor', () => {
    TestBed.configureTestingModule({
      imports: [HttpRetryModule.forRoot()],
      providers: [fakeRetryStrategyProvider]
    });

    const interceptors: HttpInterceptor[] = TestBed.get(HTTP_INTERCEPTORS);

    expect(interceptors.length).toBe(2);
    expect((interceptors[0] as any).constructor.name).toBe('HttpXsrfInterceptor'); // provided by Angular
    expect(interceptors[1] instanceof HttpRetryInterceptor).toBe(true); // provided by HttpRetryModule
  });

  it('should throw if imported more than once', () => {
    TestBed.configureTestingModule({
      imports: [HttpRetryModule.forRoot(), HttpRetryModule.forRoot()],
      providers: [fakeRetryStrategyProvider]
    });

    expect(() => TestBed.get(HTTP_INTERCEPTORS)).toThrowError(
      'HttpRetryModule is already loaded. Import it only once (e.g. in your AppModule or CoreModule).'
    );
  });

  it('should throw if no strategies are provided', () => {
    TestBed.configureTestingModule({
      imports: [HttpRetryModule.forRoot()]
    });

    expect(() => TestBed.get(HTTP_INTERCEPTORS)).toThrowError();
  });
});
