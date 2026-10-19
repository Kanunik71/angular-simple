import type { TranslationObject } from '@ngx-translate/core';

export const APP_LANG = 'ru';

export const RU: TranslationObject = {
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
    session: 'Вы вошли как {{username}}',
    add: 'Добавить',
    logout: 'Выйти',
    columnName: 'Имя',
    columnEmail: 'Email',
    columnRole: 'Роль',
    columnActions: 'Действия',
    edit: 'Изменить',
    remove: 'Удалить',
    empty: 'Пользователей пока нет',
    loadError: 'Не удалось загрузить пользователей',
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
