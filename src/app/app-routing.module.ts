import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocsHttpRetryComponent } from './docs/docs-http-retry/docs-http-retry.component';
import { DocsNgxIfElseLoadingComponent } from './docs/docs-ngx-if-else-loading/docs-ngx-if-else-loading.component';
import { DocsNgxLetComponent } from './docs/docs-ngx-let/docs-ngx-let.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'docs/http-retry', component: DocsHttpRetryComponent },
  { path: 'docs/ngx-let', component: DocsNgxLetComponent },
  { path: 'docs/ngx-if-else-loading', component: DocsNgxIfElseLoadingComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
