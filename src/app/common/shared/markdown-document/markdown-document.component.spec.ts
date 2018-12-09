import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NgxIfElseLoadingModule } from './../../../../../projects/ngx-if-else-loading/src/public_api';
import { MarkdownDocumentComponent } from './markdown-document.component';
import { MarkdownDocumentService, MarkdownDocumentType } from './markdown-document.service';

@Injectable()
class MockMarkdownDocumentService implements Partial<MarkdownDocumentService> {
  getDocument(project: string, documentType: MarkdownDocumentType) {
    return of(`${project} ${documentType}`);
  }
}

@Pipe({
  name: 'appMarkdownToHtml'
})
export class MockMarkdownToHtmlPipe implements PipeTransform {
  transform(value: string) {
    return `markdownToHtml(${value})`; // just need to know that pipe is used
  }
}

describe('MarkdownDocumentComponent', () => {
  let fixture: ComponentFixture<MarkdownDocumentComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxIfElseLoadingModule],
      declarations: [MockMarkdownToHtmlPipe, MarkdownDocumentComponent],
      providers: [{ provide: MarkdownDocumentService, useClass: MockMarkdownDocumentService }]
    });

    fixture = TestBed.createComponent(MarkdownDocumentComponent);
    nativeElement = fixture.nativeElement;

    fixture.detectChanges();
  });

  it('should be empty if the project and document type is not given', () => {
    fixture.detectChanges();

    expect(nativeElement.textContent.trim()).toBe('');
  });

  it('should be empty if the document type is not given', () => {
    fixture.componentInstance.project = 'test-project';
    fixture.detectChanges();

    expect(nativeElement.textContent.trim()).toBe('');
  });

  it('should be empty if the project is not given', () => {
    fixture.componentInstance.documentType = MarkdownDocumentType.README;
    fixture.detectChanges();

    expect(nativeElement.textContent.trim()).toBe('');
  });

  it('should display the requested document', () => {
    fixture.componentInstance.project = 'test-project';
    fixture.componentInstance.documentType = MarkdownDocumentType.README;
    fixture.detectChanges();

    expect(nativeElement.textContent.trim()).toBe('markdownToHtml(test-project README.md)');
  });

  it('should display a different document if requested', () => {
    fixture.componentInstance.project = 'test-project';
    fixture.componentInstance.documentType = MarkdownDocumentType.README;
    fixture.detectChanges();

    expect(nativeElement.textContent.trim()).toBe('markdownToHtml(test-project README.md)');

    fixture.componentInstance.project = 'test-project-2';
    fixture.componentInstance.documentType = MarkdownDocumentType.CHANGELOG;
    fixture.detectChanges();

    expect(nativeElement.textContent.trim()).toBe('markdownToHtml(test-project-2 CHANGELOG.md)');
  });
});
