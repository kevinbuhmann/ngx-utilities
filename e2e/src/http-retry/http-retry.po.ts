import { browser, by, element } from 'protractor';

export class HttpRetryPage {
  navigateTo() {
    return browser.get('/docs/http-retry');
  }

  getPageHeading() {
    return element(by.css('app-docs-http-retry h1')).getText();
  }

  getErrorMessages() {
    return element.all(by.css('app-docs-http-retry .e2e-failure-message'));
  }
}
