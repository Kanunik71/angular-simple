import { type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiCard } from './ui-card';

const meta: Meta<UiCard> = {
  title: 'UI Core/Layout/Card',
  component: UiCard,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<ui-card [flush]="flush"><p>Содержимое карточки</p></ui-card>`,
  }),
  args: {
    flush: false,
  },
};

export default meta;
type Story = StoryObj<UiCard>;

export const Default: Story = {};
export const Flush: Story = { args: { flush: true } };
