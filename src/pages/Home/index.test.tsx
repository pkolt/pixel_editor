import { test, renderPage, expect, screen } from '@/test-utils';
import Home from './';
import { PageUrl } from '@/constants/urls';

const renderHomePage = () => renderPage(<Home />, { route: { path: PageUrl.Home } });

const createTestRedirect = (buttonText: string, redirectUrl: PageUrl) => async () => {
  const { location, userEvent } = renderHomePage();
  const button = screen.getByText(buttonText);
  await userEvent.click(button);
  expect(location().pathname).toBe(redirectUrl);
};

test('show empty', async () => {
  const { location } = renderHomePage();
  expect(screen.queryAllByTestId('bitmap-item').length).toBe(0);
  expect(location().pathname).toBe(PageUrl.Home);
});

test('click create new bitmap', createTestRedirect('Create new bitmap', PageUrl.CreateBitmap));

test('click import from image', createTestRedirect('Import from image', PageUrl.ImportFromImage));

test('click import from json', createTestRedirect('Import from JSON', PageUrl.ImportFromJson));
