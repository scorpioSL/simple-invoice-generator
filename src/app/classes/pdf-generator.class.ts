import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { InvoiceData, InvoiceItem } from "../invoice/generator/generator.component";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PdfGenerator {

  public generatePDF(invoice: InvoiceData) {
    let docDefinition: TDocumentDefinitions = {
      content: [
        { text: invoice.outletName, style: 'header' },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 20, x2: 520, y2: 20, dash: { length: 2, space: 2 } }
          ]
        },
        { text: invoice.billHeading, style: 'takeAway' },
        {
          columns: [
            { text: 'BILL NO : ', style: 'billNo', width: '30%' },
            { text: invoice.billNo, style: 'billNo' },
          ]
        },
        { text: `Ordered: ${invoice.orderTimestamp.format('YYYY/MM/DD')}   ${invoice.orderTimestamp.format('HH:MM')}`, style: { alignment: 'left', fontSize: 15, marginTop: 50 } },
        { text: `Cashier:    ${invoice.cashier}`, style: { alignment: 'left', fontSize: 15, marginTop: 50 } },
        ...this.addHorizontalLine(),
        {
          text: invoice.itemStartTitle, style: { bold: true, fontSize: 18, alignment: 'center' }
        },
        ...this.addHorizontalLine(),
        {
          columns: [
            { text: 'DESCRIPTION', style: { bold: true, fontSize: 18, alignment: 'left' }, width: '80%' },
            { text: 'TOTAL', style: { bold: true, fontSize: 18, alignment: 'right' } },
          ],
        },
        ...this.addHorizontalLine(),
        // looping of items start here
        ...this.generateAllInvoiceItems(invoice),
        // looping of items ends here
        ...this.addHorizontalLine(),

        {
          columns: [
            { text: '', width: '55%' },
            { text: 'sub :', width: '25%', style: { alignment: 'left', fontSize: 15 } },
            { text: this.getAmountDigit(invoice.total), style: { alignment: 'right', fontSize: 15 } },
          ],
        },
        {
          columns: [
            { text: '', width: '55%' },
            { text: 'Bill Amt :', width: '25%', style: { alignment: 'left', fontSize: 15, bold: true } },
            { text: this.getAmountDigit(invoice.total), style: { alignment: 'right', fontSize: 15, bold: true } },
          ],
          marginTop: 10,
        },
        {
          columns: [
            { text: '', width: '55%' },
            { text: `${invoice.payType} :`, width: '25%', style: { alignment: 'left', fontSize: 15 } },
            { text: this.getAmountDigit(invoice.total), style: { alignment: 'right', fontSize: 15 } },
          ],
          marginTop: 10,
          marginBottom: 25,
        },
        {
          text: invoice.footerNote, style: { fontSize: 15, alignment: 'center' }
        },
        ...this.addHorizontalLine(),
        {
          text: invoice.developedBy, style: { fontSize: 15, alignment: 'center' }
        }
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: 'center',
          marginTop: 20,
        },
        takeAway: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          marginTop: 10,
        },
        billNo: {
          alignment: 'left',
          fontSize: 22,
          bold: true,
        },
      },
      pageSize: {
        width: 595.28,
        height: 'auto',
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }

  private addHorizontalLine(): any[] {
    return [
      {
        canvas: [
          { type: 'line', x1: 0, y1: 10, x2: 520, y2: 10, dash: { length: 2, space: 2 } }
        ]
      },
      {
        // invisible line to add margin bottom
        canvas: [
          { type: 'line', x1: 0, y1: 10, x2: 520, y2: 10, dash: { length: 2, space: 2 }, lineColor: 'white' }
        ]
      },
    ];
  }

  private getInvoiceItem(item: InvoiceItem): any[] {
    return [
      {
        columns: [
          { text: item.name, style: { fontSize: 18, alignment: 'left' }, width: '80%' },
        ],
      },
      {
        columns: [
          { text: `${item.quantity} @${item.price}`, style: { fontSize: 18, alignment: 'left' }, width: '80%' },
          {
            text: `${this.getAmountDigit(item.total)}`, style: { fontSize: 18, alignment: 'right' }
          },
        ],
      },
    ];
  }

  private getAmountDigit(n: number): string {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  private generateAllInvoiceItems(invoice: InvoiceData): any[] {
    const rows = [];
    for (const item of invoice.items) {
      rows.push(...this.getInvoiceItem(item))
    }
    return rows;
  }
}
