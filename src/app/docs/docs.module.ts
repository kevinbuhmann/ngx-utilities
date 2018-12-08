import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HttpRetryModule } from './../../../projects/http-retry/src/public_api';
import { NgxIfElseLoadingModule } from './../../../projects/ngx-if-else-loading/src/public_api';
import { NgxLetModule } from './../../../projects/ngx-let/src/public_api';
import { DocsHttpRetryComponent } from './docs-http-retry/docs-http-retry.component';
import { serverUnavailableRetryStrategyProvider } from './docs-http-retry/retry-strategies/server-unavailable.retry-strategy';
import { DocsNgxIfElseLoadingComponent } from './docs-ngx-if-else-loading/docs-ngx-if-else-loading.component';
import { DocsNgxLetComponent } from './docs-ngx-let/docs-ngx-let.component';

export const routes: Routes = [
  { path: 'http-retry', component: DocsHttpRetryComponent },
  { path: 'ngx-let', component: DocsNgxLetComponent },
  { path: 'ngx-if-else-loading', component: DocsNgxIfElseLoadingComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), HttpRetryModule.forRoot(), NgxLetModule, NgxIfElseLoadingModule],
  declarations: [DocsHttpRetryComponent, DocsNgxIfElseLoadingComponent, DocsNgxLetComponent],
  providers: [serverUnavailableRetryStrategyProvider]
})
export class DocsModule {}
