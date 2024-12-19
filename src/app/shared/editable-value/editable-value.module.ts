import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableValueComponent } from './editable-value.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditableValueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    EditableValueComponent
  ]
})
export class EditableValueModule { }
