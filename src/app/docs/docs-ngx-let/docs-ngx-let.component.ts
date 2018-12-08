import { Component } from '@angular/core';
import { of, timer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-docs-ngx-let',
  templateUrl: './docs-ngx-let.component.html'
})
export class DocsNgxLetComponent {
  readonly value: Observable<boolean>;

  constructor() {
    this.value = environment.browser ? timer(0, 1000).pipe(map(value => value % 2 === 0)) : of(true);
  }
}
