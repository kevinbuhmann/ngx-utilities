import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxNavDrawerModule } from '@ngx-lite/nav-drawer';

import { HttpRetryModule } from './../../projects/http-retry/src/public_api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocsHttpRetryComponent } from './docs/docs-http-retry/docs-http-retry.component';
import { serverUnavailableRetryStrategyProvider } from './docs/docs-http-retry/retry-strategies/server-unavailable.retry-strategy';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [BrowserModule, CommonModule, HttpClientModule, AppRoutingModule, NgxNavDrawerModule, HttpRetryModule.forRoot()],
  declarations: [AppComponent, DocsHttpRetryComponent, HomeComponent],
  providers: [serverUnavailableRetryStrategyProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}
