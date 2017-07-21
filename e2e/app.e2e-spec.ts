import { SonubPage } from './app.po';

describe('sonub App', () => {
  let page: SonubPage;

  beforeEach(() => {
    page = new SonubPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
