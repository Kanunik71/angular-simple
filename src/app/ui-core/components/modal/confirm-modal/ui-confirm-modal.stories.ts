import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { action } from 'storybook/actions';

import { MODAL_REF } from '../../../services/modal/modal-ref';
import { UiConfirmModal } from './ui-confirm-modal';

const meta: Meta<UiConfirmModal> = {
  title: 'UI Core/Modal/Confirm Modal',
  component: UiConfirmModal,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MODAL_REF,
          useValue: { close: action('modal.close') },
        },
      ],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <ui-confirm-modal
        [titleKey]="titleKey"
        [messageKey]="messageKey"
        [messageParams]="messageParams"
        [confirmLabelKey]="confirmLabelKey"
        [cancelLabelKey]="cancelLabelKey"
        [variant]="variant"
      />
    `,
  }),
  args: {
    titleKey: 'users.deleteTitle',
    messageKey: 'users.deleteConfirm',
    messageParams: { name: 'Анна Смирнова' },
    confirmLabelKey: 'users.confirmDelete',
    cancelLabelKey: 'common.cancel',
    variant: 'danger',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'danger'],
    },
    messageParams: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<UiConfirmModal>;

export const Danger: Story = {};
export const Primary: Story = { args: { variant: 'primary' } };
