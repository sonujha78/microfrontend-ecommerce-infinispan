import { Component } from '@angular/core';
import { CheckoutAdmin } from './checkout-admin/checkout-admin';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CheckoutAdmin],
  template: `<app-checkout-admin></app-checkout-admin>`,
})
export class App {}
