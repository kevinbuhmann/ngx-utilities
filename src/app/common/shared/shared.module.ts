import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxTabsModule } from '@ngx-lite/tabs';

import { NgxIfElseLoadingModule } from './../../../../projects/ngx-if-else-loading/src/public_api';
import { NgxLetModule } from './../../../../projects/ngx-let/src/public_api';
import { NgxTransferStateModule } from './../../../../projects/ngx-transfer-state/src/public_api';
import { MarkdownDocumentComponent } from './markdown-document/markdown-document.component';
import { MarkdownToHtmlPipe } from './pipes/markdown-to-html.pipe';

const modules = [CommonModule, NgxTabsModule, NgxLetModule, NgxIfElseLoadingModule, NgxTransferStateModule];

const pipes = [MarkdownToHtmlPipe];

const components = [MarkdownDocumentComponent];

@NgModule({
  imports: [...modules],
  declarations: [...pipes, ...components],
  exports: [...modules, ...pipes, ...components]
})
export class SharedModule {}
