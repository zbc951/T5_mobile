import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  static DEL_LETTER = 'del-letter';
  static DEL_ALL_LETTER = 'del_all_letter';
  static READ_ALL_LETTER = 'read_all_letter';


  static REFRESHWALLET = 'refreshWallet';
  static READPOLICY = 'readPolicy';
  static OPEN_MENU = 'openmenu';
  static MAINTAIN_UPDATE = 'maintain_update';
  static isContactPage = 'isContactPage';

  constructor() { }

  static dispatch(eventName, data = null): void {

    if (!eventName) {
      return;
    }

    if (data != null && data !== undefined) {

      window.dispatchEvent(new CustomEvent(eventName, {
        detail: {
          'data': data
        }
      }));

    } else {
      window.dispatchEvent(new CustomEvent(eventName));
    }

  }
}
