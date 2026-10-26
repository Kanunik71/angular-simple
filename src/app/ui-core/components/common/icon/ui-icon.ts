import { Component, computed, input } from '@angular/core';

export type UiIconName = 'chevron-down' | 'close' | 'trash';
export type UiIconSize = 'sm' | 'md' | 'lg';

const ICON_PATHS: Record<UiIconName, readonly string[]> = {
  'chevron-down': ['M6 9l6 6 6-6'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  trash: [
    'M3 6h18',
    'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
    'M10 11v6',
    'M14 11v6',
  ],
};

const ICON_SIZES: Record<UiIconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

@Component({
  selector: 'ui-icon',
  host: {
    class: 'ui-icon',
  },
  template: `
    <svg
      class="ui-icon__svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.width]="sizePx()"
      [attr.height]="sizePx()"
    >
      @for (path of paths(); track $index) {
        <path [attr.d]="path" />
      }
    </svg>
  `,
  styleUrl: './ui-icon.scss',
})
export class UiIcon {
  readonly name = input.required<UiIconName>();
  readonly size = input<UiIconSize>('md');

  protected readonly paths = computed(() => ICON_PATHS[this.name()]);
  protected readonly sizePx = computed(() => ICON_SIZES[this.size()]);
}
