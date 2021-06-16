import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformWalletComponent } from './platform-wallet.component';

describe('PlatformWalletComponent', () => {
  let component: PlatformWalletComponent;
  let fixture: ComponentFixture<PlatformWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
