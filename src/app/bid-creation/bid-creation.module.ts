import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidCreationComponent } from './bid-creation.component';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
      path: '', component: BidCreationComponent 
  }
]

@NgModule({
  declarations: [BidCreationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  exports: [
    BidCreationComponent
  ]
})
export class BidCreationModule { }
