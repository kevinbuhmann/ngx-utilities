import { Component } from '@angular/core';
import { timer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-docs-ngx-let',
  templateUrl: './docs-ngx-let.component.html'
})
export class DocsNgxLetComponent {
  readonly value: Observable<boolean>;

  constructor() {
    this.value = timer(0, 1000).pipe(map(value => value % 2 === 0));
  }
}
