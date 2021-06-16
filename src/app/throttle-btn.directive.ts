import { Directive, HostListener, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';


@Directive({
  selector: '[appThrottle]'
})
export class ThrottleBtnDirective implements OnInit {

  dom;
  time;
  throttleTime = 1000;

  @Output() action = new EventEmitter();


  constructor(el: ElementRef) {


    this.dom = el.nativeElement;
    // console.log('el', el, this.dom.tagName);

    this.time = new Date();

    const eventMap = {
      FORM: 'submit',
      BUTTON: 'click',
      A: 'click',
      I: 'click',
    };

    const eventName = eventMap[this.dom.tagName];
    // console.log('eventName', eventName);
    this.dom.addEventListener(eventName, (event) => {

      this.myEvent(event);

    });

  }

  ngOnInit(): void {

  }

  myEvent(event): void {

    event.preventDefault();
    event.stopPropagation();

    const t = new Date();

    const shift = t.getTime() - this.time.getTime();
    this.time = t;

    if (shift > this.throttleTime) {

      this.action.emit();
    }


  }

}
