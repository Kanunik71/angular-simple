import { type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiSpinner } from './ui-spinner';

const meta: Meta<UiSpinner> = {
  title: 'UI Core/Common/Spinner',
  component: UiSpinner,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<ui-spinner [size]="size" [hasOverlay]="hasOverlay" />`,
  }),
  args: {
    size: 'md',
    hasOverlay: false,
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<UiSpinner>;

export const Medium: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Overlay: Story = { args: { hasOverlay: true } };
