import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocsHttpRetryComponent } from './docs/docs-http-retry/docs-http-retry.component';
import { DocsNgxLetComponent } from './docs/docs-ngx-let/docs-ngx-let.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'docs/http-retry', component: DocsHttpRetryComponent },
  { path: 'docs/ngx-let', component: DocsNgxLetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
