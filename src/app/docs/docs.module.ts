import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HttpRetryModule } from './../../../projects/http-retry/src/public_api';
import { MarkdownDocumentType } from './../common/shared/markdown-document/markdown-document.service';
import { SharedModule } from './../common/shared/shared.module';
import { DemoNgxIfElseLoadingComponent } from './demo-ngx-if-else-loading/demo-ngx-if-else-loading.component';
import { DemoNgxLetComponent } from './demo-ngx-let/demo-ngx-let.component';
import { DemoHttpRetryComponent } from './docs-http-retry/demo-http-retry.component';
import { serverUnavailableRetryStrategyProvider } from './docs-http-retry/retry-strategies/server-unavailable.retry-strategy';
import { ProjectDemoComponent } from './project-demo/project-demo.component';
import { ProjectDocsTabsComponent } from './project-docs-tabs/project-docs-tabs.component';
import { ProjectDocumentComponent } from './project-document/project-document.component';

export const routes: Routes = [
  {
    path: ':project',
    component: ProjectDocsTabsComponent,
    children: [
      {
        path: '',
        component: ProjectDocumentComponent,
        data: {
          documentType: MarkdownDocumentType.README
        }
      },
      {
        path: 'changelog',
        component: ProjectDocumentComponent,
        data: {
          documentType: MarkdownDocumentType.CHANGELOG
        }
      },
      {
        path: 'demo',
        component: ProjectDemoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpRetryModule.forRoot(), SharedModule],
  declarations: [
    DemoHttpRetryComponent,
    DemoNgxIfElseLoadingComponent,
    DemoNgxLetComponent,
    ProjectDemoComponent,
    ProjectDocsTabsComponent,
    ProjectDocumentComponent
  ],
  providers: [serverUnavailableRetryStrategyProvider]
})
export class DocsModule {}
