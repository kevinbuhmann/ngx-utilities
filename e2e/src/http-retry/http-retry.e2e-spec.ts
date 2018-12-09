import { browser } from 'protractor';

import { HttpRetryPage } from './http-retry.po';

describe('http-retry', () => {
  let page: HttpRetryPage;

  beforeEach(() => {
    page = new HttpRetryPage();
  });

  it('should display project heading', () => {
    page.navigateTo();
    expect(page.getProjectHeading()).toEqual('@ngx-utilities/http-retry');
  });

  it('should show the error message after retrying', () => {
    page.navigateTo();

    expect(page.getErrorMessages().count()).toBe(0);

    browser.driver.sleep(2500);

    const errorMessages = page.getErrorMessages();
    const errorPattern = /^Received HTTP 503 from http:\/\/localhost:[0-9]+\/api\/mock-error\?errorStatusCode=503&maxErrorCount=15\.$/g;
    expect(errorMessages.count()).toBe(1);
    expect(errorMessages.get(0).getText()).toMatch(errorPattern);
  });
});
