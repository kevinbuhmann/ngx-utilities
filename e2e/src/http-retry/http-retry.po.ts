import { browser, by, element } from 'protractor';

// tslint:disable:prefer-functions

export class HttpRetryPage {
  navigateTo() {
    return browser.get('/projects/http-retry/demo');
  }

  getProjectHeading() {
    return element(by.css('app-project-docs-tabs h2')).getText();
  }

  getErrorMessages() {
    return element.all(by.css('app-demo-http-retry .e2e-failure-message'));
  }
}
