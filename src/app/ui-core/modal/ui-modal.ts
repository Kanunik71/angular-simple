import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  effect,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

let nextModalId = 0;

@Component({
  selector: 'ui-modal',
  imports: [CdkTrapFocus, TranslatePipe],
  templateUrl: './ui-modal.html',
  styleUrl: './ui-modal.scss',
})
export class UiModal {
  readonly title = input.required<string>();
  readonly open = input(false);
  readonly closed = output<void>();

  private readonly overlay = inject(Overlay);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private overlayRef: OverlayRef | null = null;
  private subscriptions = new Subscription();

  protected readonly titleId = `ui-modal-title-${nextModalId++}`;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.detach());

    effect(() => {
      if (!this.open()) {
        untracked(() => this.detach());
      }
    });

    afterRenderEffect(() => {
      const element = this.panel()?.nativeElement;
      if (!this.open() || !element) {
        return;
      }
      untracked(() => this.attach(element));
    });
  }

  protected requestClose(): void {
    this.closed.emit();
  }

  private attach(element: HTMLElement): void {
    if (this.overlayRef?.hasAttached()) {
      return;
    }

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'ui-modal-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    });
    overlayRef.attach(new DomPortal(element));
    this.subscriptions.add(overlayRef.backdropClick().subscribe(() => this.closed.emit()));
    this.subscriptions.add(
      overlayRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.closed.emit();
        }
      }),
    );
    this.overlayRef = overlayRef;
  }

  private detach(): void {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    const overlayRef = this.overlayRef;
    this.overlayRef = null;
    overlayRef?.dispose();
  }
}
