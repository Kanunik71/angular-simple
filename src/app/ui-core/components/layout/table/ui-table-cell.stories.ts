import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';

import { UiTableCell } from './ui-table-cell';

const meta: Meta<UiTableCell> = {
  title: 'UI Core/Layout/Table Cell',
  component: UiTableCell,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [UiTableCell] })],
  render: (args) => ({
    props: args,
    template: `
      <table class="ui-table">
        <tbody>
          <tr class="ui-table__row">
            <td uiTableCell [align]="align">Ячейка</td>
          </tr>
        </tbody>
      </table>
    `,
  }),
  args: {
    align: 'left',
  },
  argTypes: {
    align: {
      control: 'radio',
      options: ['left', 'center', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<UiTableCell>;

export const Left: Story = {};
export const Center: Story = { args: { align: 'center' } };
export const Right: Story = { args: { align: 'right' } };
