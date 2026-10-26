import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiInput } from '../input/ui-input';
import { UiFormField } from './ui-form-field';

const meta: Meta<UiFormField> = {
  title: 'UI Core/Form/Form Field',
  component: UiFormField,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, UiFormField, UiInput],
    }),
  ],
  render: (args) => ({
    props: { ...args, control: new FormControl('Анна Смирнова') },
    template: `
      <ui-form-field [labelKey]="labelKey">
        <ui-input [formControl]="control" />
      </ui-form-field>
    `,
  }),
  args: {
    labelKey: 'userForm.name',
  },
};

export default meta;
type Story = StoryObj<UiFormField>;

export const Default: Story = {};
