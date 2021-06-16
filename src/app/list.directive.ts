import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appList]'
})
export class ListDirective {

  @Output() gotBottom = new EventEmitter();

  constructor(el: ElementRef) {

  }

  @HostListener('scroll', ['$event'])

  onScroll(evt): void {
    const target = evt.target;
    // console.log('evt', evt);
    // console.log(target.scrollTop, target.offsetHeight, target.scrollHeight);

    if ((target.scrollTop + target.offsetHeight) >= target.scrollHeight) {
      this.gotBottom.emit();
    }
  }

}
