import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiTableCell } from './ui-table-cell';
import { UiTable, UiTableRow } from './ui-table';
import type { UiTableColumn } from './ui-table';

const columns: UiTableColumn[] = [
  { key: 'name', labelKey: 'users.columnName' },
  { key: 'email', labelKey: 'users.columnEmail' },
  { key: 'role', labelKey: 'users.columnRole' },
];

const rows = [
  { id: 1, name: 'Анна Смирнова', email: 'anna@example.com', role: 'Администратор' },
  { id: 2, name: 'Илья Орлов', email: 'ilya@example.com', role: 'Пользователь' },
  { id: 3, name: 'Мария Козлова', email: 'maria@example.com', role: 'Пользователь' },
];

const meta: Meta<UiTable> = {
  title: 'UI Core/Layout/Table',
  component: UiTable,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [UiTable, UiTableRow, UiTableCell] })],
  render: (args) => ({
    props: args,
    template: `
      <ui-table [rows]="rows" [columns]="columns" [rowKey]="rowKey" [emptyLabelKey]="emptyLabelKey">
        <ng-template uiTableRow let-row>
          <tr class="ui-table__row">
            <td uiTableCell>{{ row.name }}</td>
            <td uiTableCell>{{ row.email }}</td>
            <td uiTableCell>{{ row.role }}</td>
          </tr>
        </ng-template>
      </ui-table>
    `,
  }),
  args: {
    rows,
    columns,
    rowKey: (row: { id: number }) => row.id,
    emptyLabelKey: 'users.empty',
  },
  argTypes: {
    rowKey: { control: false },
    rows: { control: 'object' },
    columns: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<UiTable>;

export const Default: Story = {};
export const Empty: Story = { args: { rows: [] } };
