import { Component, OnDestroy } from '@angular/core';
import moment from 'moment';
import { Moment } from 'moment';
import { Subject, Subscription } from 'rxjs';
import { PdfGenerator } from '../../classes/pdf-generator.class';

export interface IInvoiceItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export class InvoiceItem implements IInvoiceItem {
  private _price: number = 0;
  private _quantity: number = 0;
  private _total: number = 0;


  public name: string = '';
  public onTotalChange: Subject<void> = new Subject<void>();

  constructor(public id: number) { }

  public get price(): number {
    return this._price;
  }

  public set price(v: number) {
    if (v === undefined) return;
    if (typeof v !== 'number') return;

    this._price = v;
    if (this._quantity) {
      this._total = this._price * this._quantity;
      this.onTotalChange.next();
    }
  }

  public get quantity(): number {
    return this._quantity;
  }

  public set quantity(v: number) {
    if (v === undefined) return;
    if (typeof v !== 'number') return;

    this._quantity = v;
    if (this._price) {
      this._total = this._price * this._quantity;
      this.onTotalChange.next();
    }
  }

  public get total(): number {
    return this._total;
  }

}

export class InvoiceData {
  public outletName: string = 'Cafe Divine Street';
  public billHeading: string = 'TAKE AWAY';
  public billNo: string;
  public itemStartTitle: string = 'INVOICE COPY';
  public orderTimestamp: Moment = moment();
  public cashier: string = 'POS';
  public invoiceTitle: string;
  public payType: string = 'BANK TRAN';
  public footerNote: string = 'Thank you. Please Visit Again.';
  public developedBy: string = 'SOFTWARE WWW.DAITONN.COM';
  private _items: InvoiceItem[] = [];
  public total: number = 0;

  public get items(): InvoiceItem[] {
    return this._items;
  }

  public addItem(): InvoiceItem {
    const item = new InvoiceItem(this._items.length + 1);
    this._items.push(item);
    return item;
  }

  public removeItem(index: number): InvoiceItem {
    return this._items.splice(index, 1)[0];
  }

  public calculateTotal(): void {
    this.total = this._items.map((i) => i.total).reduce((p, c) => p + c);
  }
}


export interface ISub {
  id: number;
  sub: Subscription;
}

@Component({
  selector: 'ngx-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnDestroy {
  private _subs: ISub[] = [];
  private _invoiceGenerator: PdfGenerator = new PdfGenerator();
  public invoice: InvoiceData = new InvoiceData();

  public createNewInvoice(): void {
    this.invoice = new InvoiceData();
    this.doUnsubAll();
  }

  public addItem(): void {
    const item = this.invoice.addItem();
    this._subs.unshift({
      id: item.id,
      sub: item.onTotalChange.subscribe(() => {
        this.invoice.calculateTotal();
      }),
    });
  }

  public removeItem(index: number): void {
    const item = this.invoice.removeItem(index);
    const subs = this._subs.filter((f) => f.id !== item.id);
    if (subs.length > 0) {
      subs.forEach((s) => s.sub.unsubscribe());
    }
  }

  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  public generatePdf(): void {
    this._invoiceGenerator.generatePDF(this.invoice);
  }

  private doUnsubAll(): void {
    this._subs.forEach((s) => s.sub.unsubscribe());
  }

  public trackBy(index: number, item: InvoiceItem) {
    return item.id;
  }

  public ngOnDestroy(): void {
    this.doUnsubAll();
  }
}
