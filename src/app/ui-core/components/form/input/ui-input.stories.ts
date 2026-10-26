import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiFormField } from '../form-field/ui-form-field';
import { UiInput } from './ui-input';

const template = `
  <ui-form-field labelKey="userForm.name">
    <ui-input [formControl]="control" [type]="type" [autocomplete]="autocomplete" />
  </ui-form-field>
`;

const meta: Meta<UiInput> = {
  title: 'UI Core/Form/Input',
  component: UiInput,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, UiFormField, UiInput],
    }),
  ],
  render: (args) => ({
    props: { ...args, control: new FormControl('Анна Смирнова') },
    template,
  }),
  args: {
    type: 'text',
    autocomplete: 'off',
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['text', 'password', 'email'],
    },
  },
};

export default meta;
type Story = StoryObj<UiInput>;

export const Text: Story = {};
export const Email: Story = { args: { type: 'email' } };
export const Password: Story = { args: { type: 'password' } };
export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl({ value: 'Анна Смирнова', disabled: true }),
    },
    template,
  }),
};
export const RequiredError: Story = {
  render: (args) => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();

    return { props: { ...args, control }, template };
  },
};
export const EmailError: Story = {
  render: (args) => {
    const control = new FormControl('bad-email', Validators.email);
    control.markAsTouched();

    return { props: { ...args, control }, template };
  },
};
