# Учебное приложение: пользователи

Закрытый справочник пользователей. Бекенда нет: HTTP-запросы выполняет тот же Angular-код через mock-interceptor. Интерфейс на русском, код на английском.

> E2E — Playwright. Инфраструктура в `e2e/`, сценарий пишется промтом рядом с тестом. Запуск: `npm run test:e2e`. Правила генерации — `e2e/AGENTS.md`.

## Стек

- Angular 21, standalone-компоненты, zoneless change detection, signals
- `HttpClient` и functional interceptors
- Reactive forms
- Angular CDK: overlay и listbox для селекта, focus trap для модалки
- `@ngx-translate/core` — локализация, язык пока один
- SCSS, БЭМ, CSS-переменные

`@angular/material` не подключаем. Готовые Material-компоненты не используем.

## Запуск

```bash
npm start
```

Приложение открывается на `http://localhost:4200`.

Демо-вход: `admin` / `admin`.

## Проверка

```bash
npm run build
npm run test:e2e:types
npx prettier --check "src/**/*.{ts,html,scss}" "e2e/**/*.{ts,md}" ".opencode/**/*.md" "playwright.config.ts"
npm run test:e2e
```

Перед первым запуском e2e один раз установить браузер: `npx playwright install chromium`.

## E2E

- `e2e/tests` — пары `<scenario>.prompt.md` + `<scenario>.spec.ts`. Промт — источник сценария, spec — сгенерированный артефакт. При изменении поведения сначала правится промт.
- Каждый spec самодостаточен: локаторы, helper-функции, авторизация и seed лежат в нём. Общих модулей для тестов нет.
- Генерация в TUI: `/e2e-generate <путь к .prompt.md>` для одного сценария или `/e2e-generate all` для всех промтов из `e2e/tests`. Команда меняет только целевые specs, форматирует их, проверяет типы и запускает тесты.
- Если не хватает `data-testid`/`data-*` или маршрута, команда не меняет `src`: в одиночном режиме останавливается и сообщает, в `all` пропускает проблемный промт. Поведение приложения и промты не меняются.
- Селекторы — только `data-testid`/`data-*`; адреса — только `allRoutes`; без `waitForTimeout`.
- Seed пользователей и учебный JWT кладутся в `sessionStorage` init-скриптами. Seed работает только в dev-режиме; изменения в InMemoryDb сбрасываются к seed при перезагрузке страницы.
- Подробности — `e2e/README.md`, правила генерации — `e2e/AGENTS.md`.

## Маршруты

| Путь              | Доступ               | Чанк              |
| ----------------- | -------------------- | ----------------- |
| `/login`          | только без сессии    | `pages/login`     |
| `/users`          | только с сессией     | `pages/users`     |
| `/users/new`      | только с сессией     | `pages/users`     |
| `/users/:id/edit` | только с сессией     | `pages/users`     |
| `/`               | редирект на `/users` | —                 |
| любой другой путь | только с сессией     | `pages/not-found` |

Секции подключены через `loadChildren`. Guard, interceptors и контракты API остаются в основном чанке: они нужны до загрузки страницы.

Форма пользователя — отдельная страница, а не модалка. `/users/new` и `/users/:id/edit` рендерят один компонент `UserCreateUpdatePage` и различаются наличием параметра `id`.

У каждой страницы свой state: `LoginPageState` у входа, `UsersPageState` у списка и `UserCreateUpdatePageState` у формы. Все провайдятся на компонентах страниц; загрузка запускается из `ngOnInit`. После сохранения форма возвращается на список, и список загружается заново — фильтры и номер страницы при этом сбрасываются.

Неавторизованный переход на любой другой адрес приводит к `/login`. Авторизованный переход на `/login` приводит к `/users`.

Неизвестный путь при активной сессии рендерит `NotFoundPage` по тому же URL, без редиректа. Если маршрут валиден, а API вернул `404`, это не страница 404: state показывает тост и ошибку на месте (например, `UserCreateUpdatePageState`).

## Роутинг

Строка маршрута живёт только в enum. В коде маршрутов и в компонентах литералов вида `'/users'` быть не должно.

- `core/router/app-route.enum.ts` — `AppRouteEnum`, верхний уровень URL
- `core/router/users-route.enum.ts` — `UsersRouteEnum`, уровень секции `users`
- `core/router/all-routes.ts` — `allRoutes`, единственное место, где склеивается путь
- `core/router/router.service.ts` — `RouterService`: `go(url)` и `back()`

Файлы `*.routes.ts` строк не содержат, только `path: UsersRouteEnum.Edit`. Переименование пути в enum меняет и роутинг, и билдер разом — оба читают одно значение.

`redirectTo` билдером не заменяем: он ждёт относительный путь, а `allRoutes.users.list()` вернул бы `/users` с ведущим слэшем, это другая семантика. Там остаётся `AppRouteEnum.Users`.

В шаблоне билдер не вызываем: `[routerLink]="allRoutes.users.new()"` — это вызов на каждом цикле проверки изменений. Правильнее посчитать строку один раз в классе.

`paramMap` в `RouterService` живёт быть не может: сервис корневой, а `inject(ActivatedRoute)` в нём вернёт корневой маршрут без параметров — `id` лежит на дочернем. Поэтому параметры читает сам компонент через `ActivatedRoute` и `toSignal`, как в `user-create-update-page.ts`.

Чего тут нет: компилятор не проверит, что в `:id/edit` подставлен параметр, и не свяжет `routerLink` с текущим маршрутом. Для этого нужен вывод `Routes` из дерева через дженерики, а он ломается на ленивом `loadChildren` с классами компонентов. На пяти маршрутах не окупается.

## Слои

```text
pages     ->  *.routes.ts + <name>-page/<name>-page.ts  ->  *.state.ts  ->  AuthService / UserService
                                                                        -> AuthMapper / UserMapper
                                                                        -> AuthApi / UsersApi
                                                                        -> HttpClient
                                                                        -> authInterceptor
                                                                        -> MockBackend
                                                                        -> AuthApiMock / UsersApiMock
                                                                        -> InMemoryDb
                                                           |
                                                           v
entities  ->  <entity>/<component>/<component>.ts
services  ->  <entity>/<entity>.service.ts
mappers   ->  <entity>/<entity>.mapper.ts
models    ->  типы по сущностям
ui-core   ->  components/{common,form,layout,modal} + services
utils     ->  классы со статическими методами
i18n      ->  словарь, лоадер, провайдер переводов
core      ->  инфраструктура: api, http, auth, router
```

Компонент не ходит в API и не знает про него. Он читает signals из `*.state.ts`, тот вызывает сервис, сервис отдаёт доменные модели. Подмена мока на реальный сервер — это удаление строки `{ provide: HttpBackend, useClass: MockBackend }` из `app.config.ts`. API-классы при этом не меняются.

## models

Слой моделей — `src/app/models`, подпапка на сущность, файл на группу типов. У всех файлов суффикс `.models.ts` — без исключений, включая не только типы.

- `models/user/` — `user.models.ts` (`UserObject`, `UserDraftModel`), `user-response.models.ts` (`UserResponseModel`), `user-role.models.ts` (`UserRoleEnum`, `UserRoleOptionModel`, `ROLE_OPTIONS`, `roleLabelKey`)
- `models/auth/` — `auth.models.ts`: `LoginRequestModel`, `SessionObject`, `JwtPayloadModel`; `auth-response.models.ts`: `LoginResponseModel`
- `models/common/` — `common.models.ts`: `ApiErrorBodyModel`, общий контракт ошибки

Суффикс отражает вид объявления: `interface` — `Model`, `class` — `Object`, `enum` и enum-подобный union — `Enum`, остальные `type` — `Type`; файл — `models.ts`. `UserObject` (класс) и `UserDraftModel` (интерфейс) живут в одном `user.models.ts`, а `UserRoleEnum` отличается суффиксом, потому что это не интерфейс и не класс, а перечисление. Сейчас `Enum` один на весь слой — `UserRoleEnum`.

Правило действует только в `models/`. Контракты API (`AuthApiContract`, `UsersApiContract`) и описания контролов (`UiSelectOption`) так не переименовываются: это не модели.

### DTO и домен

Типы делятся на два слоя, и разница видна по имени файла.

- `<entity>-response.models.ts` — то, что приходит с сервера. Поля там ровно те, что в ответе; `UserResponseModel.role` и `LoginResponseModel.role` типизированы как `UserRoleEnum`, потому что сервер отдаёт одно из известных значений.
- `<entity>.models.ts` — домен. `UserObject implements UserResponseModel` добавляет то, что считает маппер: `initials`, `isAdmin`.

Наследование ставим, когда это тот же объект с большей детализацией. Если сущности разные, даже при совпадении полей, наследования нет — связь выражает маппер. `SessionObject` не наследует `LoginResponseModel`: ответ логина и сессия приложения — разные сущности, они просто похожи.

Запросы пока ходят по доменным типам: `UsersApi.create(body: UserDraftModel)`. Симметричного `UserCreateRequestModel` нет, потому что форма и сервер сейчас совпадают и маппинг был бы тождественным. Заводить DTO для запроса, когда сервер начнёт принимать другую форму.

В `models/<entity>/` лежит всё, что описывает значения сущности: типы, enum-подобные union-типы, списки значений для селектов и их подписи. Списки значений и их подписи — часть модели, а не утилита страницы: `ROLE_OPTIONS` и `roleLabelKey` лежат в `models/user/`, а не в `pages/users/`.

Подписи в модели хранятся ключами перевода, а не готовым текстом: `ROLE_OPTIONS[].labelKey` — это `roles.admin`, а `roleLabelKey(role)` возвращает ключ. Модель не знает про `TranslateService` — переводом занимается шаблон. Иначе модель зависела бы от i18n. По той же причине в модели нет готовых подписей: даже те, что считает маппер, не тянут текст, только значения вроде `initials` и `isAdmin`.

Модель не знает про `ui-core`. Тип элемента списка описываем сами (`UserRoleOptionModel`), а не импортируем `UiSelectOption`: структурная совместимость позволяет передать его в селект без обратной зависимости.

Barrel-файлов нет: импортируем нужный файл напрямую. Одна сущность тянет другую только явным импортом, например `models/auth/auth.models.ts` берёт `UserRoleEnum` из `models/user/user-role.models.ts`.

`ui-core` не знает про пользователей и авторизацию. Компоненты получают данные через `input`, `output` и reactive forms.

## services

Слой `src/app/services` — доступ к данным поверх API. Два data-сервиса: `services/user/user.service.ts` и `services/auth/auth.service.ts`. Рядом лежит сценарный `services/user/user-action.service.ts`: он не ходит в API напрямую, а собирает подтверждение с текстовыми ключами и вызывает `UserService`. Сценарный сервис тоже не знает про `pages`, не держит состояние и возвращает `Observable`, но, в отличие от data-сервиса, зависит от `ui-core`.

- Не знает про `pages` и `entities`. Сервис не знает, кто его зовёт.
- Не держит состояние: ни `signal`, ни подписки. Возвращает `Observable`. Состояние живёт в `*.state.ts`
- `providedIn: 'root'`, в отличие от state
- Подтверждение и текстовые ключи действия живут в сценарном сервисе, а не в data-сервисе и не в каждой странице. Саму модалку открывает `ConfirmService` из `ui-core`

Порядок такой: `*.state.ts` → сервис → маппер → API. State отвечает за реактивность и за тексты ошибок, сервис — за форму данных, маппер — за преобразование ответа, API — за провод.

## mappers

Слой `src/app/mappers` — преобразование ответов API в доменные модели. Подпапка на сущность, файл `<entity>.mapper.ts`: `mappers/user/user.mapper.ts`, `mappers/auth/auth.mapper.ts`.

- Класс со статическими методами, без DI и состояния
- Зависит только от `models`: на вход `<entity>-response.models.ts`, на выход `<entity>.models.ts`
- Не знает про `services`, `pages`, `entities` и `core`
- Сервис вызывает маппер; сама связь «ответ → домен» выражена здесь, а не в модели

Маппер считает доменные поля. Роль не нормализуется: response типизирован `UserRoleEnum`, поэтому неожиданное значение с сервера считается нарушением контракта.

## entities

Слой `src/app/entities` — переиспользуемые компоненты, которые знают про сущность, но не про конкретную страницу. Сейчас там один компонент: `entities/user/user-create-update-form/`.

- Не импортирует из `pages`. Иначе «общий» компонент оказывается привязан к секции, ради которой его выносили
- Не ходит в API и не держит состояние — только `input` и `output`. Состояние и HTTP остаются в `pages/<section>/<page>/<page>.state.ts`
- `UserCreateUpdateForm` рендерит только поля; submit, loading и текст ошибки остаются на странице
- Вложенность как в `pages`: `<entity>/<component>/<component>.ts`; в `ui-core/components` компонент лежит внутри группы
- **Критерий переезда:** подкомпонент уезжает из своей страницы в `entities`, когда понадобился второй странице. Не заранее

Граница с `ui-core`: `ui-core` — про что угодно и ни про какую сущность, `entities` — про конкретную сущность. `UserCreateUpdateForm` знает про `ROLE_OPTIONS`, поэтому в `ui-core` ему нельзя.

## utils

Повторяемые функции без состояния лежат в `src/app/utils`. Это классы со статическими методами: один файл на одну функцию не заводим.

Внутри `utils` допустимо деление по сущности: `utils/user`, `utils/forms`. Проверки форм собраны в `FormValidators` (`utils/forms`), кодирование base64url — в `Base64Url` (`utils/base64`), чтение payload — в `Jwt`, выпуск и проверка токена — в `AccessToken` (обе в `utils/jwt`), помощники мока — в `Mock` (`utils/mock`), разбор ошибки ответа — в `ApiError` (`utils/http`).

Отличие от `models`: утилита не знает предметной области, она работает с любыми значениями. Подписи ролей и список значений для селекта — это знания о сущности, поэтому им место в `models/<entity>/`, а не в `utils`.

## Локализация

Переводы — `@ngx-translate/core`, слой лежит в `src/app/i18n`. Язык пока один, но схема рассчитана на добавление.

- `i18n/ru.ts` — словарь `RU` и константа `APP_LANG`
- `i18n/static-translate-loader.ts` — `StaticTranslateLoader`, отдаёт словарь из памяти
- `i18n/translate.config.ts` — `provideAppTranslate()`, подключается в `app.config.ts`

HTTP-лоадер не нужен: словарь лежит в коде. Подключать `@ngx-translate/http-loader` нельзя — его запрос ушёл бы в `MockBackend` и получил бы `404`.

В шаблоне — пайп `| translate`, в TypeScript — `translate.instant('ключ', { params })`. Ключей в компонентах не хардкодим русским текстом.

Если параметр, поле конфига или input принимает ключ перевода, в имени есть суффикс `Key`: `fallbackKey`, `labelKey`, `emptyLabelKey`, `confirmLabelKey`, `titleKey`. Текст без суффикса: `ToastService.success(message)`, `UiModal.title`, `PageHeader.title`. По имени сразу видно, что переводить, а что показывать как есть.

Два места словаря живут вне слоя i18n осознанно:

- Ответы `*.api.mock.ts` — это ответ сервера, он по-русски и переводится на клиенте, а не на сервере.
- `<title>` в `src/index.html` — статический, до бутстрапа.

## Авторизация

Учебный JWT состоит из трёх частей: `header.payload.signature`. В payload лежат `sub`, `role` и `exp` (8 часов).

- Секрет и проверка подписи живут только в `src/app/utils/jwt/access-token.ts`. Подпись учебная, это не HMAC.
- Клиент хранит токен в `sessionStorage` под ключом `exam.accessToken`.
- `authInterceptor` добавляет `Authorization: Bearer`.
- Ответ `401` на любом запросе, кроме логина, очищает сессию и открывает `/login`.
- При старте клиент читает срок `exp`, чтобы не показывать протухшую сессию. Подпись всё равно проверяет мок.

Вход и справочник разделены. Учётка `admin` не является строкой в таблице. У карточек пользователей нет пароля.

## Мок

Бекенд имитирует `MockBackend` (`src/app/core/http/mock-backend.ts`): он подменяет `HttpBackend`, поэтому запрос доходит до интерцепторов, но в сеть не уходит. Задержка ответа — 400 мс.

Логика каждой сущности лежит в моке рядом с её API-классом. Контракт общий, он объявлен в `*.api.ts` как `AuthApiContract` и `UsersApiContract`.

- `src/app/core/api/auth.api.mock.ts` — вход, выпуск учебного токена
- `src/app/core/api/users.api.mock.ts` — список и сохранение, `InMemoryDb` лежит рядом
- `src/app/utils/mock/mock.ts` — `Mock.fail`, разбор тела запроса, задержка

Мок отвечает тем же, что ответил бы сервер: успех отдаёт значение, ошибка — `HttpErrorResponse` с `{ code }`. Код ошибки — это ключ перевода (`apiErrors.*`), его переводит UI через `translate`. В `HttpResponse` его оборачивает сам `MockBackend`.

`MockBackend` знает только вещи, не относящиеся к сущности: карту маршрутов, проверку токена, задержку. Ответ на запрос, который не начинается с `/api/`, — `404`.

- `POST /api/auth/login`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

Ошибки: `400` на пустые поля, неверный email и дубль email; `401` без токена, с чужой подписью или с истёкшим сроком; `404`, если пользователь не найден.

Данные лежат в памяти вкладки. Обновление страницы сохраняет сессию, но возвращает стартовый список. Созданные карточки после перезагрузки исчезают.

Стартовые записи: Анна Смирнова, Илья Орлов, Мария Козлова.

## Состояние

Файл `*.state.ts` — класс со `signal` и `computed`. Если страница владеет формой, `FormGroup` лежит в state; шаблон читает signals и эту форму. Подписка на HTTP остаётся внутри state.

- `AuthState` — сессия всего приложения, `providedIn: 'root'`
- `LoginPageState` — форма входа, `loading` и `error` делегирует в `AuthState`, после успешного входа переводит на список; провайдится на `LoginPage`
- `UsersPageState` — список, фильтры и удаление; `list: ListState`, `filterForm: FormGroup`, `loader: LoaderState`; провайдится на `UsersPage`, загрузка запускается из `ngOnInit`
- `UserCreateUpdatePageState` — загрузка, валидация, подготовка draft и сохранение пользователя; `loader: LoaderState`, `form: FormGroup`; провайдится на `UserCreateUpdatePage`, загрузка запускается из `ngOnInit`

У страницы своё UI-состояние: открыт ли диалог удаления, кого удаляем. Это остаётся в `UsersPage`; форма пользователя живёт в `UserCreateUpdatePageState`.

## ui-core

Слой разделён на компоненты и сервисы.

Компоненты лежат в `components/` и сгруппированы по назначению:

- `components/common/` — `ui-alert`, `ui-button`, `ui-icon`, `ui-skeleton`, `ui-spinner`, `ui-toast`
- `components/form/` — `ui-form`, `ui-form-actions`, `ui-form-field`, `ui-input`, `ui-select`; общий стиль контролов — `field/ui-field.scss`
- `components/layout/` — `ui-card`, `ui-filters`, `ui-pagination`, `ui-table`
- `components/modal/` — `ui-modal`, `ui-confirm-modal`

Сервисы лежат в `services/`:

- `ToastService` — `services/toast.service.ts`
- `ModalService` / `ModalRef` / `ConfirmService` — `services/modal/`

- `button[uiButton]` — варианты `primary`, `secondary`, `ghost`, `danger`; `fullWidth` растягивает кнопку на 100%. Нативный `type` и `disabled` остаются на кнопке.
- `ui-icon` рисует inline SVG из карты в коде, принимает `name` и `size` (`sm` 16px, `md` 20px, `lg` 24px), цвет наследует через `currentColor`.
- `ui-filters` — только раскладка фильтров: grid и `ng-content`. `FormGroup` и сами поля остаются на странице; компонент не знает ни про сущность, ни про состав фильтров.
- `ui-input` и `ui-select` реализуют `ControlValueAccessor`.
- `ui-select` — кастомный селект: кнопка-триггер, панель в `CdkConnectedOverlay` и список на `CdkListbox`. Нативного `<select>` нет; выбранный вариант ведёт `CdkListbox`, панель стилизована в `ui-select.scss`.
- `UiSelectOption.labelKey` — это ключ перевода, `ui-select` прогоняет его через `| translate` сам. Вызывающий код подписи не переводит.
- `ui-modal` переносит панель в CDK Overlay, ловит фокус через `cdkTrapFocus` и закрывается по backdrop, Escape и кнопке.
- `ConfirmService.ask` держит только одну активную модалку подтверждения: новый вызов и переход по маршруту закрывают предыдущую. Текстовые ключи передаёт вызывающий сценарный сервис.
- `ToastService.fromError(error, fallbackKey)` разбирает ошибку через `ApiError`, переводит fallback, пишет `console.error`, показывает тост и возвращает текст. Состояния передают его в `errorMessage` и поля ошибок.

## ARIA

ARIA вручную пока не поддерживаем: не добавляем `aria-*`, ARIA-роли (`role="..."`, `[attr.role]`) и `ariaCurrentWhenActive`. Это временное ограничение, а не пропуск в конкретном компоненте. Исключение — `CdkListbox` внутри `ui-select`: он сам проставляет `role="listbox"/"option"` и `aria-*`, не дублируем и не переопределяем их.

## Стили

- `src/styles/palette.scss` — только сырые цвета `--palette-*`
- `src/styles/variables.scss` — смысловые токены `--color-*`, отступы, радиус, тень, шрифт. Они ссылаются на палитру.
- `src/styles/base.scss` — reset и базовая типографика
- `src/styles/ui-core.scss` — глобальные правила `ui-core`, чей DOM живёт вне компонента
- `src/styles.scss` — глобальная точка входа, подключает файлы выше через `@use`. Правил здесь не пишем, только `@use`.
- Стили компонента лежат рядом с ним.

Backdrop модалки — единственное глобальное правило сейчас, и оно в `styles/ui-core.scss`, а не в корне. Причина в том, что CDK Overlay создаёт его в `<body>`: стиль компонента к нему не применится, потому что ViewEncapsulation приписывает селектору атрибут компонента. Правило перестало быть «настоящим» для модалки — но пока это работает, трогать не нужно: при следующем переезде проверим визуально.

Классы по БЭМ: `user-table`, `user-table__cell`, `user-table__cell--actions`, `ui-button--danger`. В компонентных файлах блок на хосте задаётся через `:host`, потому что у ViewEncapsulation селектор класса с хоста не совпадает. В DOM класс блока всё равно есть.

Размеры только в `px`. `rem` и `em` не используем: токены заданы под корневой шрифт 16px, поэтому `1rem` = `16px`, и пересчитывать в rem или em незачем. Отступы, радиусы, кегли и ширины берём из `variables.scss`; в компоненте остаются только те значения, которых нет в токенах, и тоже в `px`.

Компоненты берут цвета и отступы только из `var(--...)`. На палитру напрямую не ссылаются.

## Как добавить страницу

1. Создать `src/app/pages/<name>/` со своим `<name>.routes.ts` и страницей. Каждый компонент лежит в своей папке с файлами одного имени: `<name>-page/<name>-page.ts`; state страницы — рядом, `<name>-page/<name>-page.state.ts`. Подкомпоненты страницы — так же, в `<component>/<component>.ts`, как в `ui-core`; когда такой подкомпонент понадобится второй странице, он переезжает в `src/app/entities/<entity>/`.
2. Подключить маршруты через `loadChildren` и закрыть их `authGuard`, если страница не публичная. Сегменты пути берутся из enum, в `app.routes.ts` — `AppRouteEnum`.
3. Провайдить `PageState` на компоненте страницы, а не в `root`, и запускать загрузку из `ngOnInit`.
4. Ходить в бекенд через отдельный API-класс и `HttpClient`. Доступ приложения к API — через `src/app/services/<entity>/<entity>.service.ts`; ответы в доменные модели переводит `src/app/mappers/<entity>/<entity>.mapper.ts`.
5. Новый ответ мока добавить в `*.api.mock.ts` рядом с его API-классом и в карту маршрутов `MockBackend`.
6. Повторяемые контролы класть в `ui-core/components` в подходящую группу: `common`, `form`, `layout`, `modal`; сервисы `ui-core` — в `ui-core/services`. Утилиты — классом со статическими методами в `src/app/utils`. Знания о сущности — типы, списки значений и подписи — класть в `src/app/models/<entity>/`: интерфейс с суффиксом `Model`, перечисление с `Enum`, остальные `type` с `Type`, файл с `.models.ts`.
7. Стили страницы писать по БЭМ и на токенах из `variables.scss`. Новый сырой цвет — только в `palette.scss`. Размеры в `px`, без `rem` и `em`.
8. Все пользовательские строки брать из словаря: в шаблоне `| translate`, в TypeScript `translate.instant()`. Новый ключ добавлять в `i18n/ru.ts`.
