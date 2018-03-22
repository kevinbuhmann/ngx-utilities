import { browser, by, element } from 'protractor';

export class NgxHttpRetryClickPage {
  navigateTo() {
    return browser.get('/docs/ngx-http-retry');
  }

  getPageHeading() {
    return element(by.css('app-docs-ngx-http-retry h1')).getText();
  }

  getErrorMessages() {
    return element.all(by.css('app-docs-ngx-http-retry .e2e-failure-message'));
  }
}
