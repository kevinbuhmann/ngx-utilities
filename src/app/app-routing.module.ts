import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocsNgxHttpRetryComponent } from './docs/docs-ngx-http-retry/docs-ngx-http-retry.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'docs/ngx-http-retry', component: DocsNgxHttpRetryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
