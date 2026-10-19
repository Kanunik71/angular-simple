import type { TranslationObject } from '@ngx-translate/core';

export const APP_LANG = 'ru';

export const RU: TranslationObject = {
  app: {
    title: 'Справочник пользователей',
    nav: 'Основная навигация',
    navUsers: 'Пользователи',
    session: 'Вы вошли как {{username}}',
    logout: 'Выйти',
    footer: 'Учебное приложение. Данные хранятся в памяти вкладки.',
  },
  common: {
    cancel: 'Отмена',
    backToList: 'К списку',
    close: 'Закрыть',
    loading: 'Загрузка…',
  },
  roles: {
    user: 'Пользователь',
    admin: 'Администратор',
  },
  pagination: {
    label: 'Постраничная навигация',
    previous: 'Назад',
    next: 'Вперёд',
    page: 'Страница {{page}} из {{total}}',
  },
  login: {
    title: 'Вход',
    hint: 'Демо-учётка: admin / admin',
    username: 'Логин',
    password: 'Пароль',
    submit: 'Войти',
    submitting: 'Вход…',
  },
  users: {
    title: 'Пользователи',
    add: 'Добавить',
    search: 'Поиск',
    allRoles: 'Все роли',
    columnName: 'Имя',
    columnEmail: 'Email',
    columnRole: 'Роль',
    columnActions: 'Действия',
    edit: 'Изменить',
    remove: 'Удалить',
    empty: 'Пользователей пока нет',
    loadError: 'Не удалось загрузить пользователей',
    loadUserError: 'Не удалось загрузить пользователя',
    saveError: 'Не удалось сохранить пользователя',
    removeError: 'Не удалось удалить пользователя',
    deleteTitle: 'Удаление пользователя',
    deleteConfirm: 'Удалить {{name}}? Это действие нельзя отменить.',
    confirmDelete: 'Удалить',
  },
  userForm: {
    createTitle: 'Новый пользователь',
    editTitle: 'Редактировать пользователя',
    notFound: 'Пользователь не найден',
    name: 'Имя',
    email: 'Email',
    role: 'Роль',
    save: 'Сохранить',
    saving: 'Сохранение…',
  },
  errors: {
    required: 'Заполните поле «{{label}}»',
    email: 'Введите корректный email',
    invalid: 'Проверьте значение поля',
    login: 'Не удалось войти',
  },
};
