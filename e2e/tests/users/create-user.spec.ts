import { expect, test } from '@playwright/test';

import { TOKEN_STORAGE_KEY } from '../../../src/app/core/auth/token-storage-key';
import { allRoutes } from '../../../src/app/core/router/all-routes';
import { AccessToken } from '../../../src/app/utils/jwt/access-token';

test('создаёт пользователя', async ({ page }) => {
  await page.addInitScript(({ key, value }) => sessionStorage.setItem(key, value), {
    key: TOKEN_STORAGE_KEY,
    value: AccessToken.create({ sub: 'admin', role: 'admin' }),
  });

  await page.goto(allRoutes.users.list());
  await page.getByTestId('users-add').click();
  await expect(page).toHaveURL(allRoutes.users.new());

  await page.getByTestId('user-form-name-field').locator('input').fill('Иван Тестов');
  await page.getByTestId('user-form-email-field').locator('input').fill('ivan@example.com');
  await page.getByTestId('user-form-role-field').locator('button').click();
  await page.locator('[data-testid="select-option"][data-value="user"]').click();
  await page.getByTestId('user-form-save').click();

  await expect(page).toHaveURL(allRoutes.users.list());
  const row = page.locator('[data-testid="user-row"][data-user-email="ivan@example.com"]');
  await expect(row).toBeVisible();
  await expect(row.getByTestId('user-name')).toHaveText('Иван Тестов');
  await expect(row.getByTestId('user-role')).toHaveText('Пользователь');
  await expect(page.getByTestId('toast').last()).toContainText('Пользователь создан');
});
