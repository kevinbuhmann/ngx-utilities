import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxNavDrawerModule } from 'ngx-nav-drawer';

import { NgxHttpRetryModule } from './../lib/ngx-http-retry/public_api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocsNgxHttpRetryComponent } from './docs/docs-ngx-http-retry/docs-ngx-http-retry.component';
import { serverUnavailableRetryStrategyProvider } from './docs/docs-ngx-http-retry/retry-strategies/server-unavailable.retry-strategy';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [BrowserModule, CommonModule, HttpClientModule, AppRoutingModule, NgxNavDrawerModule, NgxHttpRetryModule.forRoot()],
  declarations: [AppComponent, DocsNgxHttpRetryComponent, HomeComponent],
  providers: [serverUnavailableRetryStrategyProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}
