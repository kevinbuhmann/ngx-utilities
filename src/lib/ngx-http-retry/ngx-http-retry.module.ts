import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { ngxHttpRetryInterceptorProvider } from './ngx-http-retry.interceptor';
import { NgxHttpRetryService } from './ngx-http-retry.service';

@NgModule({
  imports: [HttpClientModule]
})
export class NgxHttpRetryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxHttpRetryModule,
      providers: [NgxHttpRetryService, ngxHttpRetryInterceptorProvider]
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: NgxHttpRetryModule
  ) {
    if (parentModule) {
      throw new Error('NgxHttpRetryModule is already loaded. Import it only once (e.g. in your AppModule or CoreModule).');
    }
  }
}
