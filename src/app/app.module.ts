import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxNavDrawerModule } from 'ngx-nav-drawer';

import { NgxGithubCornerModule } from './../lib/ngx-github-corner/public_api';
import { NgxHttpRetryModule } from './../lib/ngx-http-retry/public_api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CodeHighlightComponent } from './docs/code-highlight/code-highlight.component';
import { DocsNgxGithubCornerComponent } from './docs/docs-ngx-github-corner/docs-ngx-github-corner.component';
import { DocsNgxHttpRetryComponent } from './docs/docs-ngx-http-retry/docs-ngx-http-retry.component';
import { serverUnavailableRetryStrategyProvider } from './docs/docs-ngx-http-retry/retry-strategies/server-unavailable.retry-strategy';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    NgxNavDrawerModule,
    NgxGithubCornerModule,
    NgxHttpRetryModule.forRoot()
  ],
  declarations: [AppComponent, CodeHighlightComponent, DocsNgxGithubCornerComponent, DocsNgxHttpRetryComponent, HomeComponent],
  providers: [serverUnavailableRetryStrategyProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}
