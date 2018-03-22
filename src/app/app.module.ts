import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxNavDrawerModule } from 'ngx-nav-drawer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, NgxNavDrawerModule],
  declarations: [AppComponent, HomeComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
