import { type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiSkeleton } from './ui-skeleton';

const meta: Meta<UiSkeleton> = {
  title: 'UI Core/Common/Skeleton',
  component: UiSkeleton,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<ui-skeleton [width]="width" [height]="height" [variant]="variant" />`,
  }),
  args: {
    width: '100%',
    height: '16px',
    variant: 'block',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['text', 'block', 'circle'],
    },
  },
};

export default meta;
type Story = StoryObj<UiSkeleton>;

export const Block: Story = {};
export const Text: Story = { args: { variant: 'text' } };
export const Circle: Story = {
  args: {
    width: '48px',
    height: '48px',
    variant: 'circle',
  },
};
