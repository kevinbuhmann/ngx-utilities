import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { getAsyncError } from './../../testing/async-testing.helpers';
import { MarkdownDocumentService, MarkdownDocumentType } from './markdown-document.service';

describe('MarkdownDocumentService', () => {
  let httpMock: HttpTestingController;
  let markdownDocumentService: MarkdownDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpMock = TestBed.get(HttpTestingController);
    markdownDocumentService = TestBed.get(MarkdownDocumentService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getDocument', () => {
    it('should get a readme', async () => {
      const getDocument = markdownDocumentService.getDocument('test-project', MarkdownDocumentType.README).toPromise();
      httpMock.expectOne('/projects/test-project/README.md').flush('test-content');

      expect(await getDocument).toBe('test-content');
    });

    it('should remove the project title from a readme', async () => {
      const getDocument = markdownDocumentService.getDocument('test-project', MarkdownDocumentType.README).toPromise();
      httpMock.expectOne('/projects/test-project/README.md').flush('# test-project\n\ntest-content');

      expect(await getDocument).toBe('test-content');
    });

    it('should get a changelog', async () => {
      const getDocument = markdownDocumentService.getDocument('test-project', MarkdownDocumentType.CHANGELOG).toPromise();
      httpMock.expectOne('/projects/test-project/CHANGELOG.md').flush('test-content');

      expect(await getDocument).toBe('test-content');
    });

    it('should remove the changelog title from a changelog', async () => {
      const getDocument = markdownDocumentService.getDocument('test-project', MarkdownDocumentType.CHANGELOG).toPromise();
      httpMock.expectOne('/projects/test-project/CHANGELOG.md').flush('# changelog\n\ntest-content');

      expect(await getDocument).toBe('test-content');
    });

    it('should return undefined if document is not found', async () => {
      const getDocument = markdownDocumentService.getDocument('test-project', MarkdownDocumentType.README).toPromise();
      httpMock.expectOne('/projects/test-project/README.md').flush('', { status: 404, statusText: 'Not Found' });

      expect(await getDocument).toBe(undefined);
    });

    it('should rethrow errors other than not found', async () => {
      const getDocument = markdownDocumentService.getDocument('test-project', MarkdownDocumentType.README).toPromise();
      httpMock.expectOne('/projects/test-project/README.md').flush('', { status: 500, statusText: 'Internal Server Error' });

      const error: HttpErrorResponse = await getAsyncError(getDocument);

      expect(error).toBeDefined('expected an error to be thrown');
      expect(error instanceof HttpErrorResponse).toBe(true, 'expected the error to be an instance of HttpErrorResponse');
      expect(error.status).toBe(500, 'expected an HTTP 500 error');
    });
  });
});
