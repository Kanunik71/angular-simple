import { expect, test } from '@playwright/test';

import { allRoutes } from '../../../src/app/core/router/all-routes';

test('перенаправляет неавторизованного пользователя на вход', async ({ page }) => {
  await page.goto(allRoutes.users.list());

  await expect(page).toHaveURL(allRoutes.login());
  await expect(page.getByTestId('login-submit')).toBeVisible();
});
