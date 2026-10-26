# E2E на Playwright

Тесты запускаются против dev-сервера `http://localhost:4200`. Playwright сам поднимает `npm start`, если сервер не запущен.

## Установка

```bash
npm install
npx playwright install chromium
```

## Запуск

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:debug
npm run test:e2e:report
```

## Структура

```text
e2e/
  tests/                     промты и сгенерированные тесты
  templates/scenario.prompt.md
  AGENTS.md                  правила генерации тестов по промту
```

Каждый spec самодостаточен: локаторы, helper-функции, авторизация и seed лежат в нём. Общих модулей для тестов нет.

## Генерация через команду opencode

В TUI доступны два режима:

```text
/e2e-generate e2e/tests/users/create-user.prompt.md
/e2e-generate all
```

Первый генерирует один spec, второй — все specs по промтам из `e2e/tests`. В обоих режимах меняются только целевые specs; другие файлы и папки не создаются. Весь тестовый код остаётся в spec. Если не хватает `data-testid` или маршрута, команда не меняет `src`: в одиночном режиме останавливается и сообщает, в `all` пропускает проблемный промт. Поведение приложения и промты не меняются.

Вне TUI можно использовать CLI:

```bash
opencode run --command e2e-generate "e2e/tests/users/create-user.prompt.md"
opencode run --command e2e-generate "all"
```

## Как добавить сценарий

1. Скопируй `e2e/templates/scenario.prompt.md` рядом с будущим тестом.
2. Назови файл `<scenario>.prompt.md` и опиши подготовку, шаги и проверку.
3. Сгенерируй тест командой `/e2e-generate <scenario>.prompt.md`.
4. При необходимости запусти весь набор: `npm run test:e2e`.

Промт — источник сценария. При изменении поведения сначала правь промт, затем перегенерируй spec.

## Подготовка данных

Бэкенд — in-browser mock, внешнего API нет. Каждый spec готовит данные локально через `page.addInitScript`:

- `TOKEN_STORAGE_KEY` и `AccessToken` — учебный JWT;
- `DB_SEED_KEY` — seed пользователей.

Seed читается только в dev-режиме. Перезагрузка страницы сбрасывает InMemoryDb к seed.

## Селекторы

Тесты опираются на `data-testid`, а не на русский текст или CSS-классы. `ui-select` дополнительно отдаёт `data-value` у опций. Роуты берутся из `allRoutes`.
