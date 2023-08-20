import { Component } from '@angular/core';
import { TranslationService } from 'src/app/translation.service';

@Component({
  selector: 'app-option-card',
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.css'],
})
export class OptionCardComponent {
  constructor(public translationService: TranslationService) {}
}
