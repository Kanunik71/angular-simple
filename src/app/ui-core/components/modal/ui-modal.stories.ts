import { type Meta, type StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { UiModal } from './ui-modal';

const meta: Meta<UiModal> = {
  title: 'UI Core/Modal/Modal',
  component: UiModal,
  tags: ['autodocs'],
  render: (args) => ({
    props: { ...args, closed: fn() },
    template: `
      <ui-modal [title]="title" (closed)="closed()">
        <p>Содержимое модального окна.</p>
      </ui-modal>
    `,
  }),
  args: {
    title: 'Заголовок модального окна',
  },
};

export default meta;
type Story = StoryObj<UiModal>;

export const Default: Story = {};
