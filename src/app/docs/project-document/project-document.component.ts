import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getMergedRouteData, getMergedRouteParams } from './../../common/helpers/router.helpers';
import { MarkdownDocumentType } from './../../common/shared/markdown-document/markdown-document.service';

@Component({
  selector: 'app-project-document',
  templateUrl: './project-document.component.html'
})
export class ProjectDocumentComponent {
  readonly project: Observable<string>;
  readonly documentType: Observable<MarkdownDocumentType>;

  constructor(router: Router) {
    this.project = getMergedRouteParams(router).pipe(map(routeParams => routeParams['project']));
    this.documentType = getMergedRouteData(router).pipe(map(routeData => routeData['documentType']));
  }
}
