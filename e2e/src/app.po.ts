import { browser, by, element } from 'protractor';

// tslint:disable:prefer-functions

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root p')).getText();
  }
}
