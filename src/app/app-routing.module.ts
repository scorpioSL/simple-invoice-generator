import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: 'invoice-generator',
    loadChildren: () => import('./invoice/invoice.module')
      .then(m => m.InvoiceModule),
  },
  { path: '', redirectTo: 'invoice-generator', pathMatch: 'full' },
  { path: '**', redirectTo: 'invoice-generator' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
