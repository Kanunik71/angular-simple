import { expect, test } from '@playwright/test';

import { TOKEN_STORAGE_KEY } from '../../../src/app/core/auth/token-storage-key';
import { DB_SEED_KEY } from '../../../src/app/core/http/in-memory-db.seed';
import type { DbSeedModel } from '../../../src/app/core/http/in-memory-db.seed';
import { allRoutes } from '../../../src/app/core/router/all-routes';
import type { UserResponseModel } from '../../../src/app/models/user/user-response.models';
import { AccessToken } from '../../../src/app/utils/jwt/access-token';

const EDIT_USER: UserResponseModel = {
  id: 'e2e-edit-user',
  fullName: 'Иван Тестов',
  email: 'ivan@example.com',
  role: 'user',
};

const SEED: DbSeedModel = { mode: 'append', users: [EDIT_USER] };

test('редактирует пользователя из подготовленных данных', async ({ page }) => {
  await page.addInitScript(({ key, value }) => sessionStorage.setItem(key, value), {
    key: TOKEN_STORAGE_KEY,
    value: AccessToken.create({ sub: 'admin', role: 'admin' }),
  });
  await page.addInitScript(({ key, value }) => sessionStorage.setItem(key, JSON.stringify(value)), {
    key: DB_SEED_KEY,
    value: SEED,
  });

  await page.goto(allRoutes.users.list());

  const row = page.locator(`[data-testid="user-row"][data-user-email="${EDIT_USER.email}"]`);
  await expect(row).toBeVisible();
  await row.getByTestId('user-edit').click();
  await expect(page).toHaveURL(allRoutes.users.edit(EDIT_USER.id));

  await page.getByTestId('user-form-name-field').locator('input').fill('Иван Изменённый');
  await page.getByTestId('user-form-email-field').locator('input').fill('ivan.changed@example.com');
  await page.getByTestId('user-form-role-field').locator('button').click();
  await page.locator('[data-testid="select-option"][data-value="admin"]').click();
  await page.getByTestId('user-form-save').click();

  await expect(page).toHaveURL(allRoutes.users.list());
  const updatedRow = page.locator(
    '[data-testid="user-row"][data-user-email="ivan.changed@example.com"]',
  );
  await expect(updatedRow).toBeVisible();
  await expect(updatedRow.getByTestId('user-name')).toHaveText('Иван Изменённый');
  await expect(updatedRow.getByTestId('user-role')).toHaveText('Администратор');
  await expect(page.getByTestId('toast').last()).toContainText('Пользователь сохранён');
});
