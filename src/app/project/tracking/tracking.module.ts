import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingComponent } from './tracking.component';
import { TotalsModule } from '../totals/totals.module';

@NgModule({
  declarations: [TrackingComponent],
  imports: [
    CommonModule,
    TotalsModule,
  ],
  exports: [TrackingComponent]
})
export class TrackingModule { }
