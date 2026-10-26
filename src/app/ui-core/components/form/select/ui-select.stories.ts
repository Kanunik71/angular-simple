import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiFormField } from '../form-field/ui-form-field';
import { UiSelect } from './ui-select';

const options = [
  { value: 'user', labelKey: 'roles.user' },
  { value: 'admin', labelKey: 'roles.admin' },
];

const template = `
  <ui-form-field labelKey="userForm.role">
    <ui-select [formControl]="control" [options]="options" />
  </ui-form-field>
`;

const meta: Meta<UiSelect> = {
  title: 'UI Core/Form/Select',
  component: UiSelect,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, UiFormField, UiSelect],
    }),
  ],
  render: (args) => ({
    props: { ...args, control: new FormControl('user') },
    template,
  }),
  args: {
    options,
  },
};

export default meta;
type Story = StoryObj<UiSelect>;

export const Default: Story = {};
export const Disabled: Story = {
  render: (args) => ({
    props: {
      ...args,
      control: new FormControl({ value: 'user', disabled: true }),
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
