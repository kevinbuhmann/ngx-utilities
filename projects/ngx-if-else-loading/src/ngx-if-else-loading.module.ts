import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { NgxLoadersModule } from '@ngx-lite/loaders';

import { NgxIfElseLoadingDefaultLoadingSpinnerComponent } from './ngx-if-else-loading-default-loading-spinner/ngx-if-else-loading-default-loading-spinner.component';
import { NGX_IF_ELSE_LOADING_CUSTOM_LOADING_COMPONENT } from './ngx-if-else-loading.di-tokens';
import { LoadingComponent, NgxIfElseLoadingDirective } from './ngx-if-else-loading.directive';

@NgModule({
  imports: [CommonModule, NgxLoadersModule],
  declarations: [NgxIfElseLoadingDirective, NgxIfElseLoadingDefaultLoadingSpinnerComponent],
  exports: [NgxIfElseLoadingDirective, NgxIfElseLoadingDefaultLoadingSpinnerComponent],
  entryComponents: [NgxIfElseLoadingDefaultLoadingSpinnerComponent]
})
export class NgxIfElseLoadingModule {
  static withCustomLoadingComponent(customLoadingComponent: Type<LoadingComponent>): ModuleWithProviders {
    return {
      ngModule: NgxIfElseLoadingModule,
      providers: [
        {
          provide: NGX_IF_ELSE_LOADING_CUSTOM_LOADING_COMPONENT,
          useValue: customLoadingComponent
        }
      ]
    };
  }
}
