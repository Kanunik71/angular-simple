import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiSkeleton } from '../../common/skeleton/ui-skeleton';
import { UiTableCell } from './ui-table-cell';
import { UiTableSkeleton, UiTableSkeletonRow } from './ui-table-skeleton';
import type { UiTableColumn } from './ui-table';

const columns: UiTableColumn[] = [
  { key: 'name', labelKey: 'users.columnName' },
  { key: 'email', labelKey: 'users.columnEmail' },
  { key: 'role', labelKey: 'users.columnRole' },
];

const meta: Meta<UiTableSkeleton> = {
  title: 'UI Core/Layout/Table Skeleton',
  component: UiTableSkeleton,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [UiTableSkeleton, UiTableSkeletonRow, UiTableCell, UiSkeleton],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <ui-table-skeleton [columns]="columns" [rows]="rows">
        <ng-template uiTableSkeletonRow>
          <tr class="ui-table__row">
            <td uiTableCell><ui-skeleton /></td>
            <td uiTableCell><ui-skeleton /></td>
            <td uiTableCell><ui-skeleton /></td>
          </tr>
        </ng-template>
      </ui-table-skeleton>
    `,
  }),
  args: {
    columns,
    rows: 5,
  },
};

export default meta;
type Story = StoryObj<UiTableSkeleton>;

export const Default: Story = {};
