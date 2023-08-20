import { TranslationService } from './../../translation.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['../stepper.component.css'],
})
export class StepOneComponent {
  @Input() personal!: FormGroup;
  @Output() nextStepData: EventEmitter<any> = new EventEmitter<any>();

  constructor(public translationService: TranslationService) {}

  onStepOneNext() {
    if (this.personal.valid) {
      this.nextStepData.emit(this.personal.value);
    }
  }
}
