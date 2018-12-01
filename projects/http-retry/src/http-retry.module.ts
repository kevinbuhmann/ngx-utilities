import { HttpClientModule, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Inject, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { httpRetryInterceptorProvider, HttpRetryInterceptor } from './http-retry.interceptor';

@NgModule({
  imports: [HttpClientModule]
})
export class HttpRetryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HttpRetryModule,
      providers: [httpRetryInterceptorProvider]
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: HttpRetryModule,
    @Inject(HTTP_INTERCEPTORS) httpInterceptors: HttpInterceptor[]
  ) {
    const httpRetryInterceptors = httpInterceptors.filter(httpInterceptor => httpInterceptor instanceof HttpRetryInterceptor);

    if (parentModule || httpRetryInterceptors.length > 1) {
      throw new Error('HttpRetryModule is already loaded. Import it only once (e.g. in your AppModule or CoreModule).');
    }
  }
}
