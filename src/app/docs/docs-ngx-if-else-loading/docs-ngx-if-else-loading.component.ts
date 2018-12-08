import { Component } from '@angular/core';
import { of, timer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-docs-ngx-if-else-loading',
  templateUrl: './docs-ngx-if-else-loading.component.html'
})
export class DocsNgxIfElseLoadingComponent {
  readonly loaded: Observable<boolean>;

  constructor() {
    this.loaded = environment.browser ? timer(0, 1000).pipe(map(value => value % 5 !== 0)) : of(false);
  }
}
