import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { ThemeModule } from '../@theme/theme.module';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbMenuModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { GeneratorComponent } from './generator/generator.component';
import { FormsModule } from '@angular/forms';
import { NbMomentDateModule } from '@nebular/moment';


@NgModule({
  declarations: [
    InvoiceComponent,
    GeneratorComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbAccordionModule,
    NbSpinnerModule,
    NbButtonModule,
    FormsModule,
    NbInputModule,
    NbSelectModule,
    NbIconModule,
    NbMomentDateModule,
    NbDatepickerModule,
  ]
})
export class InvoiceModule { }
