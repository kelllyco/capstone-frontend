import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-editable-value',
  templateUrl: './editable-value.component.html',
  styleUrl: './editable-value.component.css'
})
export class EditableValueComponent {
  @Input() type!: string;
  @Input() value!: number;
  @Output() valueChange = new EventEmitter<number>();
  @ViewChild('editInput') editInput!: ElementRef;
  
  isEditing = false;
  editValue!: number;

  enableEditing() {
    this.isEditing = true;
    this.editValue = this.value; // init input with current value

    setTimeout(() => {
      if (this.editInput) {
        const input = this.editInput.nativeElement;
        input.focus();
        input.select();
      }
    })
  }

  saveValue() {
    this.isEditing = false;
    if (this.editValue < 0 || this.editValue === null) {
      this.editValue = 0;
    }
    this.value = this.editValue;
    this.valueChange.emit(this.value);
  }

  selectValue(event: Event) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

}
