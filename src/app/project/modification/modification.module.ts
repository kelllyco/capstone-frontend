import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModificationComponent } from './modification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TotalsModule } from '../totals/totals.module';
import { EditableValueModule } from "../../shared/editable-value/editable-value.module";



@NgModule({
  declarations: [ModificationComponent],
  imports: [
    CommonModule,
    FormsModule,
    TotalsModule,
    EditableValueModule
],
  exports: [ModificationComponent]
})
export class ModificationModule { }
