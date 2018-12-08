import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxNavDrawerModule } from '@ngx-lite/nav-drawer';

import { HttpRetryModule } from './../../projects/http-retry/src/public_api';
import { NgxIfElseLoadingModule } from './../../projects/ngx-if-else-loading/src/ngx-if-else-loading.module';
import { NgxLetModule } from './../../projects/ngx-let/src/public_api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocsHttpRetryComponent } from './docs/docs-http-retry/docs-http-retry.component';
import { serverUnavailableRetryStrategyProvider } from './docs/docs-http-retry/retry-strategies/server-unavailable.retry-strategy';
import { DocsNgxIfElseLoadingComponent } from './docs/docs-ngx-if-else-loading/docs-ngx-if-else-loading.component';
import { DocsNgxLetComponent } from './docs/docs-ngx-let/docs-ngx-let.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'ngx-utilities' }),
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    NgxNavDrawerModule,
    HttpRetryModule.forRoot(),
    NgxLetModule,
    NgxIfElseLoadingModule
  ],
  declarations: [
    AppComponent,
    DocsHttpRetryComponent,
    DocsNgxLetComponent,
    DocsNgxIfElseLoadingComponent,
    HomeComponent,
    NotFoundComponent
  ],
  providers: [serverUnavailableRetryStrategyProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}
