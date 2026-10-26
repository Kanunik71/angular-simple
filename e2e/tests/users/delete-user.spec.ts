import { expect, test } from '@playwright/test';

import { TOKEN_STORAGE_KEY } from '../../../src/app/core/auth/token-storage-key';
import { DEFAULT_USERS } from '../../../src/app/core/http/in-memory-db.defaults';
import { allRoutes } from '../../../src/app/core/router/all-routes';
import { AccessToken } from '../../../src/app/utils/jwt/access-token';

const DEMO_USER = DEFAULT_USERS[1];

test('удаляет пользователя после подтверждения', async ({ page }) => {
  await page.addInitScript(({ key, value }) => sessionStorage.setItem(key, value), {
    key: TOKEN_STORAGE_KEY,
    value: AccessToken.create({ sub: 'admin', role: 'admin' }),
  });

  await page.goto(allRoutes.users.list());

  const row = page.locator(`[data-testid="user-row"][data-user-email="${DEMO_USER.email}"]`);
  await expect(row).toBeVisible();

  await row.getByTestId('user-remove').click();

  await expect(page.getByTestId('confirm-modal')).toBeVisible();
  await expect(page.getByTestId('confirm-modal-message')).toContainText(DEMO_USER.fullName);

  await page.getByTestId('confirm-modal-confirm').click();

  await expect(row).toHaveCount(0);
  await expect(page.getByTestId('toast').last()).toContainText('Пользователь удалён');
});
