import { InjectionToken } from '@angular/core';

import { HttpRequestRetryStrategy } from './http-retry.helpers';

export const HTTP_REQUEST_RETRY_STRATEGIES = new InjectionToken<HttpRequestRetryStrategy>('HTTP_REQUEST_RETRY_STRATEGIES');
