# Правила генерации e2e-тестов

Промт рядом с тестом — источник сценария. `.spec.ts` генерируется по промту и может быть перезаписан.

## Изоляция генерации

При каждом запуске меняется только целевой `<scenario>.spec.ts`. Если spec ещё нет — создаётся только он.

- В режиме `all` меняются только specs, для которых есть парный промт.
- Не создавай и не меняй другие файлы и папки: helpers вне spec, `src`, документацию, конфиги, `package.json`.
- Промт не меняется: сценарий правит пользователь.
- Весь тестовый код — в spec: локаторы, helper-функции, авторизация и seed.
- Дублирование между specs допустимо и ожидаемо.
- Если не хватает testid или маршрута — не меняй `src`: для одного промта остановись и сообщи; в режиме `all` пропусти проблемный промт, перейди к следующему и перечисли всё в конце.
- Если приложение ведёт себя неверно — сообщи, не подгоняй тест.

## Команда генерации

В TUI используй `/e2e-generate <путь к .prompt.md>` для одного сценария или `/e2e-generate all` для всех промтов из `e2e/tests`. Команда читает промты и `e2e/AGENTS.md`, меняет только целевые specs, форматирует их, проверяет типы и запускает тесты.

## Что можно импортировать

- `@playwright/test` — `test`, `expect`, типы `Page` и `Locator`
- `src/app/core/router/all-routes` — `allRoutes`
- `src/app/core/auth/token-storage-key` — `TOKEN_STORAGE_KEY`
- `src/app/core/http/in-memory-db.seed` — `DB_SEED_KEY`, `DbSeedModel`
- `src/app/core/http/in-memory-db.defaults` — `DEFAULT_USERS`
- `src/app/utils/jwt/access-token` — `AccessToken`
- `src/app/models/**` — типы и enum

## Соответствие фраз промта

| В промте                               | В тесте                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| «авторизуйся демо-администратором»     | локальный `authenticateAsDemo(page)` через `AccessToken` и `TOKEN_STORAGE_KEY` |
| «без сессии»                           | не вызывать `authenticateAsDemo`                                               |
| «возьми демо-пользователя»             | `DEFAULT_USERS` или локальные константы в spec                                 |
| «создай пользователя ...» в подготовке | `seedUsers(page, { mode: 'append', users: [...] })`                            |
| «пустой список»                        | `seedUsers(page, { mode: 'replace', users: [] })`                              |
| «много пользователей»                  | `seedUsers(page, { mode: 'replace', users: [...] })`                           |
| «страница входа»                       | `page.goto(allRoutes.login())`                                                 |
| «пользователи»                         | `page.goto(allRoutes.users.list())`                                            |
| «форма пользователя»                   | `page.goto(allRoutes.users.new())` или raw-локаторы полей                      |
| «шапка»                                | `page.getByTestId('app-session')`                                              |
| «подтверждение»                        | `page.getByTestId('confirm-modal')` и вложенные testid                         |
| «тост»                                 | `page.getByTestId('toast').last()`                                             |

## Обязательные правила

- Импортируй `test` и `expect` из `@playwright/test`.
- Селекторы — только `data-testid` или `data-*`. CSS-классы, текст и структура DOM не используются.
- Адреса — только через `allRoutes` из `src/app/core/router/all-routes`.
- Не используй `waitForTimeout`. Playwright и `expect` сами ждут результат.
- В конце теста должны быть проверки из раздела «Проверка» промта.
- Один промт — один сценарий и один тест.
- Код и идентификаторы — на английском, названия тестов и промты — на русском.
- Если для шага не хватает testid или маршрута — не меняй `src`: остановись и сообщи. В режиме `all` пропусти проблемный промт.
- Если приложение ведёт себя неверно — сообщи, не подгоняй тест.

## Подготовка данных

Seed применяется до первой навигации. Если `page.addInitScript` вызван после открытия страницы, перезагрузи страницу. Перезагрузка сбрасывает InMemoryDb к seed.

Пример:

```ts
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
```

Seed-хелпер для сценариев с подготовкой данных. Импортируй `Page`, `DbSeedModel` и `DB_SEED_KEY` из разрешённых модулей:

```ts
async function seedUsers(page: Page, seed: DbSeedModel): Promise<void> {
  await page.addInitScript(({ key, value }) => sessionStorage.setItem(key, JSON.stringify(value)), {
    key: DB_SEED_KEY,
    value: seed,
  });
}
```
