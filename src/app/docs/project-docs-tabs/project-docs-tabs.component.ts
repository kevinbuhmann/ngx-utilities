import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getMergedRouteParams } from './../../common/helpers/router.helpers';

@Component({
  selector: 'app-project-docs-tabs',
  templateUrl: './project-docs-tabs.component.html'
})
export class ProjectDocsTabsComponent {
  readonly project: Observable<string>;

  constructor(router: Router) {
    this.project = getMergedRouteParams(router).pipe(map(routeParams => routeParams['project']));
  }
}
