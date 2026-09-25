import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-admin.html',
  styleUrl: './checkout-admin.css',
})
export class CheckoutAdmin {
  view = signal<'checkout' | 'admin'>('checkout');

  orders = [
    { id: 'ORD-1001', total: 4999, status: 'Processing' },
    { id: 'ORD-1002', total: 18999, status: 'Shipped' },
  ];

  switchView(v: 'checkout' | 'admin') {
    this.view.set(v);
  }
}
