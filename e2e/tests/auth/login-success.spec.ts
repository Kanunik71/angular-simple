import { expect, test } from '@playwright/test';

import { DEFAULT_USERS } from '../../../src/app/core/http/in-memory-db.defaults';
import { allRoutes } from '../../../src/app/core/router/all-routes';

const DEMO_ADMIN = DEFAULT_USERS[0];

test('входит демо-администратором', async ({ page }) => {
  await page.goto(allRoutes.login());

  await page.getByTestId('login-username-field').locator('input').fill('admin');
  await page.getByTestId('login-password-field').locator('input').fill('admin');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(allRoutes.users.list());
  await expect(page.getByTestId('app-session')).toContainText('admin');
  await expect(
    page.locator(`[data-testid="user-row"][data-user-email="${DEMO_ADMIN.email}"]`),
  ).toBeVisible();
});
