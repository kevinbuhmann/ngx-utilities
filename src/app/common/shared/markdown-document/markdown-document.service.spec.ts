import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

import { TransferStateService } from './../../services/transfer-state.service';
import { getAsyncError } from './../../testing/async-testing.helpers';
import { MarkdownDocumentService, MarkdownDocumentType } from './markdown-document.service';

describe('MarkdownDocumentService', () => {
  let httpMock: HttpTestingController;
  let markdownDocumentService: MarkdownDocumentService;
  let mockTransferStateService: SinonStubbedInstance<TransferStateService>;

  beforeEach(() => {
    mockTransferStateService = createStubInstance(TransferStateService);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: TransferStateService, useValue: mockTransferStateService }]
    });

    httpMock = TestBed.get(HttpTestingController);
    markdownDocumentService = TestBed.get(MarkdownDocumentService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getDocument', () => {
    let transferStateService_transfer: jasmine.Spy;

    beforeEach(() => {
      const fakeTransfer = <T>(_key: string, source: Observable<T>) => source;
      transferStateService_transfer = spyOn(mockTransferStateService, 'transfer').and.callFake(fakeTransfer);
    });

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

    it('should use the transfer state service', async () => {
      markdownDocumentService.getDocument('test-project', MarkdownDocumentType.README);

      expect(transferStateService_transfer).toHaveBeenCalled();
      const [key, source] = transferStateService_transfer.calls.first().args as [string, Observable<string>];

      const getDocument = source.toPromise();
      httpMock.expectOne('/projects/test-project/README.md').flush('test-content');

      expect(key).toBe('test-project/README.md');
      expect(await getDocument).toBe('test-content');
    });
  });
});
