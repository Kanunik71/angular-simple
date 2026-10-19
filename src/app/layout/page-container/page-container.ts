import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-container',
  host: {
    class: 'page-container',
    '[class.page-container--narrow]': 'width() === "narrow"',
  },
  templateUrl: './page-container.html',
  styleUrl: './page-container.scss',
})
export class PageContainer {
  readonly width = input<'wide' | 'narrow'>('wide');
}
