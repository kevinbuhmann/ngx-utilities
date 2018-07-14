import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { httpRetryInterceptorProvider } from './http-retry.interceptor';

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
    parentModule: HttpRetryModule
  ) {
    if (parentModule) {
      throw new Error('HttpRetryModule is already loaded. Import it only once (e.g. in your AppModule or CoreModule).');
    }
  }
}
