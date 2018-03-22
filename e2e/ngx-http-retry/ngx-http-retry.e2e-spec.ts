import { browser } from 'protractor';

import { NgxHttpRetryClickPage } from './ngx-http-retry.po';

describe('ngx-http-retry', () => {
  let page: NgxHttpRetryClickPage;

  beforeEach(() => {
    page = new NgxHttpRetryClickPage();
  });

  it('should display heading', () => {
    page.navigateTo();
    expect(page.getPageHeading()).toEqual('ngx-http-retry');
  });

  it('should show the error message after retrying', () => {
    page.navigateTo();

    expect(page.getErrorMessages().count()).toBe(0);

    browser.driver.sleep(5000);

    const errorMessages = page.getErrorMessages();
    const errorPattern = /^Received HTTP 503 from http:\/\/localhost:[0-9]+\/api\/mock-error\?errorStatusCode=503&maxErrorCount=15\.$/g;
    expect(errorMessages.count()).toBe(1);
    expect(errorMessages.get(0).getText()).toMatch(errorPattern);
  });
});
