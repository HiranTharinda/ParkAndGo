import {browser, by, element, ElementFinder, protractor} from 'protractor';
describe('new App', () => {

  beforeEach(()=>{
    var until = protractor.ExpectedConditions;
    browser.wait(until.elementToBeClickable(element(by.id('email'))), 30000, 'Element didnt load in 30 seconds')
  })

  it('click login button with valid credentials', async () => {
      const usernameInput = await element(by.id('email'));
      usernameInput.click();
      usernameInput.sendKeys('ranikamadurawe@gmail.com');
      const passwordInput = await element(by.id('password'));
      passwordInput.click();
      await passwordInput.sendKeys('P!zzahut5');

      browser.sleep(1000);
      await element(by.id('login')).click();
      await expect(1).toBe(1);
  });
});
