import { Component } from '@angular/core';
import { of, timer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-demo-ngx-if-else-loading',
  templateUrl: './demo-ngx-if-else-loading.component.html'
})
export class DemoNgxIfElseLoadingComponent {
  readonly loaded: Observable<boolean>;

  constructor() {
    this.loaded = environment.browser ? timer(0, 1000).pipe(map(value => value % 5 !== 0)) : of(false);
  }
}
