import { FormControl, Validators } from '@angular/forms';
import { type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiFormErrors } from './ui-form-errors';

const requiredControl = new FormControl('', Validators.required);
requiredControl.markAsTouched();

const emailControl = new FormControl('bad-email', Validators.email);
emailControl.markAsTouched();

const meta: Meta<UiFormErrors> = {
  title: 'UI Core/Form/Form Errors',
  component: UiFormErrors,
  tags: ['autodocs'],
  render: (args) => ({
    props: { ...args, control: requiredControl },
    template: `<ui-form-errors [control]="control" [labelKey]="labelKey" />`,
  }),
  args: {
    labelKey: 'userForm.name',
  },
  argTypes: {
    control: { control: false },
  },
};

export default meta;
type Story = StoryObj<UiFormErrors>;

export const Required: Story = {};
export const Email: Story = {
  render: (args) => ({
    props: { ...args, control: emailControl },
    template: `<ui-form-errors [control]="control" [labelKey]="labelKey" />`,
  }),
};
