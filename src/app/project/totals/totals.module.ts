import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalsComponent } from './totals.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [TotalsComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [TotalsComponent],
})
export class TotalsModule { }
