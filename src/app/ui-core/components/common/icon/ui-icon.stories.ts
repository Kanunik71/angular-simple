import { type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiIcon } from './ui-icon';

const meta: Meta<UiIcon> = {
  title: 'UI Core/Common/Icon',
  component: UiIcon,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<ui-icon [name]="name" [size]="size" />`,
  }),
  args: {
    name: 'close',
    size: 'md',
  },
  argTypes: {
    name: {
      control: 'radio',
      options: ['close', 'trash'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<UiIcon>;

export const Close: Story = {};
export const Trash: Story = { args: { name: 'trash' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
