import { Component, Input } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ObserveProperty } from './../../../../../projects/observe-property/src/public_api';
import { MarkdownDocumentService, MarkdownDocumentType } from './markdown-document.service';

@Component({
  selector: 'app-markdown-document',
  templateUrl: './markdown-document.component.html'
})
export class MarkdownDocumentComponent {
  @Input() project: string;
  @Input() documentType: MarkdownDocumentType;
  @Input() transferStateKey: string;

  @ObserveProperty('project') private readonly projectChanges: Observable<string>;
  @ObserveProperty('documentType') private readonly documentTypeChanges: Observable<MarkdownDocumentType>;

  readonly markdownContent: Observable<string>;

  constructor(private readonly markdownDocumentService: MarkdownDocumentService) {
    this.markdownContent = combineLatest(this.projectChanges, this.documentTypeChanges).pipe(
      switchMap(([project, documentType]) => this.markdownDocumentService.getDocument(project, documentType))
    );
  }
}
