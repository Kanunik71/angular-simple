import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiFormField } from '../../form/form-field/ui-form-field';
import { UiInput } from '../../form/input/ui-input';
import { UiSelect } from '../../form/select/ui-select';
import { UiFilters } from './ui-filters';

const options = [
  { value: 'user', labelKey: 'roles.user' },
  { value: 'admin', labelKey: 'roles.admin' },
];

const createForm = () =>
  new FormGroup({
    search: new FormControl(''),
    role: new FormControl(''),
  });

const meta: Meta<UiFilters> = {
  title: 'UI Core/Layout/Filters',
  component: UiFilters,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, UiFilters, UiFormField, UiInput, UiSelect],
    }),
  ],
  render: () => ({
    props: { form: createForm(), options },
    template: `
      <ui-filters [formGroup]="form">
        <ui-form-field labelKey="users.search">
          <ui-input formControlName="search" autocomplete="off" />
        </ui-form-field>
        <ui-form-field labelKey="users.columnRole">
          <ui-select formControlName="role" [options]="options" />
        </ui-form-field>
      </ui-filters>
    `,
  }),
};

export default meta;
type Story = StoryObj<UiFilters>;

export const Default: Story = {};
