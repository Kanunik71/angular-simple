import { type Meta, type StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';

import { UiPagination } from './ui-pagination';

const meta: Meta<UiPagination> = {
  title: 'UI Core/Layout/Pagination',
  component: UiPagination,
  tags: ['autodocs'],
  render: (args) => ({
    props: { ...args, pageChange: fn() },
    template: `<ui-pagination [page]="page" [pageCount]="pageCount" (pageChange)="pageChange($event)" />`,
  }),
  args: {
    page: 1,
    pageCount: 5,
  },
};

export default meta;
type Story = StoryObj<UiPagination>;

export const First: Story = {};
export const Middle: Story = { args: { page: 3 } };
export const Last: Story = { args: { page: 5 } };
export const SinglePage: Story = { args: { page: 1, pageCount: 1 } };
