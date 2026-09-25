import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutAdmin } from './checkout-admin';

describe('CheckoutAdmin', () => {
  let component: CheckoutAdmin;
  let fixture: ComponentFixture<CheckoutAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
