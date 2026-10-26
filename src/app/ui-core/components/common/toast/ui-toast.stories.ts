import { type Meta, type StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { UiToast } from './ui-toast';

const meta: Meta<UiToast> = {
  title: 'UI Core/Common/Toast',
  component: UiToast,
  tags: ['autodocs'],
  render: (args) => ({
    props: { ...args, closed: fn() },
    template: `<ui-toast [variant]="variant" [message]="message" (closed)="closed()" />`,
  }),
  args: {
    variant: 'info',
    message: 'Пользователь сохранён',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['info', 'success', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<UiToast>;

export const Info: Story = {};
export const Success: Story = {
  args: {
    variant: 'success',
    message: 'Пользователь сохранён',
  },
};
export const Error: Story = {
  args: {
    variant: 'error',
    message: 'Не удалось сохранить пользователя',
  },
};
