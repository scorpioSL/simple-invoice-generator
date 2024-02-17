import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'ngx-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  public menuItems: NbMenuItem[] = [
    {
      title: 'Generate',
      icon: 'shopping-cart-outline',
      link: '/invoice-generator',
      home: true,
    }
  ];

}
