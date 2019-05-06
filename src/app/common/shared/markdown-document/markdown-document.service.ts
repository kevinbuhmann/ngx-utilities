import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from './../../../../environments/environment';

export enum MarkdownDocumentType {
  README = 'README.md',
  CHANGELOG = 'CHANGELOG.md'
}

@Injectable({ providedIn: 'root' })
export class MarkdownDocumentService {
  constructor(private readonly httpClient: HttpClient) {}

  getDocument(project: string, documentType: MarkdownDocumentType) {
    return this.httpClient.get(`${environment.appUrl}/projects/${project}/${documentType}`, { responseType: 'text' }).pipe(
      catchError(error => (error instanceof HttpErrorResponse && error.status === 404 ? of(undefined) : throwError(error))),
      map(document => (document ? removeFirstHeader(document, project, documentType) : undefined))
    );
  }
}

function removeFirstHeader(document: string, project: string, documentType: MarkdownDocumentType) {
  switch (documentType) {
    case MarkdownDocumentType.README:
      return document.replace(new RegExp(`^#\\s*${project}`, 'i'), '').trim();
    case MarkdownDocumentType.CHANGELOG:
      return document.replace(new RegExp(`^#\\s*CHANGELOG`, 'i'), '').trim();
  }
}
