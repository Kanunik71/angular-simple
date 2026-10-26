import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiButton } from './ui-button';

const meta: Meta<UiButton> = {
  title: 'UI Core/Common/Button',
  component: UiButton,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [UiButton] })],
  render: (args) => ({
    props: args,
    template: `<button uiButton [variant]="variant" [fullWidth]="fullWidth">Сохранить</button>`,
  }),
  args: {
    variant: 'primary',
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<UiButton>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const FullWidth: Story = { args: { fullWidth: true } };
