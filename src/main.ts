import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Prism from 'prismjs';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

(Prism as any).manual = true;

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(error => {
      console.log(error);
    });
});
