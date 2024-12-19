import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from './chatbot.component';
import { SharedModule } from '../shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChatbotComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
  ],
  exports: [
    ChatbotComponent
  ]
})
export class ChatbotModule { }
