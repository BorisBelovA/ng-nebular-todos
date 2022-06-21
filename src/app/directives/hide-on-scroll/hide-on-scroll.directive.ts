import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { fromEvent, map, Subject, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[appHideOnScroll]'
})
export class HideOnScrollDirective implements OnDestroy {

  public scroll$ = fromEvent(this.document, 'scroll');
  
  public elementHidden$ = this.scroll$.pipe(
    map(_ => this.document.defaultView && this.document.defaultView.scrollY > 50)
  )

  private destroy$ = new Subject();
  
  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.elementHidden$.pipe(
      tap(hidden => {
        if (hidden) {
          this.renderer.addClass(this.el.nativeElement, 'translate-y-100__negative');
        } else {
          this.renderer.removeClass(this.el.nativeElement, 'translate-y-100__negative')
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  public ngOnDestroy(): void {
    this.destroy$.next(null);
  }

}
