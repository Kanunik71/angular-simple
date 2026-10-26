import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { UiButton } from '../common/button/ui-button';
import { UiFormField } from './form-field/ui-form-field';
import { UiInput } from './input/ui-input';
import { UiFormActions } from './ui-form-actions';
import { UiForm } from './ui-form';

const createForm = () =>
  new FormGroup({
    fullName: new FormControl('Анна Смирнова'),
    email: new FormControl('anna@example.com'),
  });

const meta: Meta<UiForm> = {
  title: 'UI Core/Form/Form',
  component: UiForm,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, UiForm, UiFormField, UiInput, UiFormActions, UiButton],
    }),
  ],
  render: (args) => ({
    props: { ...args, submitted: fn() },
    template: `
      <ui-form [formGroup]="formGroup" (submitted)="submitted()">
        <ui-form-field labelKey="userForm.name">
          <ui-input formControlName="fullName" />
        </ui-form-field>
        <ui-form-field labelKey="userForm.email">
          <ui-input type="email" formControlName="email" />
        </ui-form-field>
        <ui-form-actions>
          <button uiButton type="submit">Сохранить</button>
        </ui-form-actions>
      </ui-form>
    `,
  }),
  args: {
    formGroup: createForm(),
  },
  argTypes: {
    formGroup: { control: false },
  },
};

export default meta;
type Story = StoryObj<UiForm>;

export const Default: Story = {};
