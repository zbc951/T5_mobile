import { FormControl, NgControl } from '@angular/forms';
import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective implements OnInit {

  regexStr = '^[0-9_.]+$';
  // regexStr = '^[0-9]+$';

  // 要不要檢查小數點兩位
  isSetting = true;
  tmp;

  constructor(
    private _el: ElementRef,
    private formctrl: NgControl
  ) { }

  ngOnInit() {

  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event) {

    // console.log('onKeyPress', event.key);
    // console.log(new RegExp(this.regexStr).test(event.key));
    const { value } = this.formctrl.control;
    // console.log(value);

    if (value && value.toString().includes('.') && event.key == '.') {
      return false;
    }

    return (new RegExp(this.regexStr).test(event.key));

  }

  @HostListener('keyup', ['$event'])
  onkeyup(event) {
    // console.log('onkeyup', event.key);
    // const { value } = this._el.nativeElement;
    const { value } = this.formctrl.control;
    // console.log('value', value);

    if (!value) {

      if (event.key == "Backspace") {

        // console.log('Backspace');

      } else {

        this.formctrl.control.patchValue(this.tmp);
      }


    } else {

      const tmpstr = String(value);

      if (this.isSetting && tmpstr.includes('.')) {

        const f = tmpstr.split('.')[1];
        const len = f.length;

        if (len > 2) {

          const tmpnum = Number(tmpstr.slice(0, -1));
          this.tmp = tmpnum;
          this.formctrl.control.patchValue(this.tmp);
          return;

        }
      }

      this.tmp = value;
    }

  }


  @HostListener('paste', ['$event'])
  blockPaste(event: ClipboardEvent) {

    this.validateFields(event);

  }

  validateFields(event: ClipboardEvent) {
    event.preventDefault();
    // console.log('pasteData', event.clipboardData.getData('text/plain'));
    const pasteData = event.clipboardData.getData('text/plain').replace(/[^0-9]/g, '');

    document.execCommand('insertHTML', false, pasteData);

  }

}
