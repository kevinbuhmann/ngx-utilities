import { InjectionToken } from '@angular/core';

import { LoadingComponent } from './ngx-if-else-loading.directive';

export const NGX_IF_ELSE_LOADING_CUSTOM_LOADING_COMPONENT = new InjectionToken<LoadingComponent>(
  'NGX_IF_ELSE_LOADING_CUSTOM_LOADING_COMPONENT'
);
