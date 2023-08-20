import { Component, Input } from '@angular/core';
import { FormDataModel } from 'src/app/form-data-model';
import { TranslationService } from 'src/app/translation.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css'],
})
export class CardDetailsComponent {
  @Input() car: FormDataModel | undefined;
  showFullPhoneNumber: boolean = false;

  constructor(public translationService: TranslationService) {}

  formatNumber(number: string) {
    if (!this.showFullPhoneNumber) {
      const firstChars = number.slice(0, 5);
      const remaining = number.slice(5);
      const signs = 'X'.repeat(remaining.length);
      number = firstChars + signs;
    }

    const countryCode = number.slice(0, 3);
    const areaCode = number.slice(3, 5);
    const firstPart = number.slice(5, 8);
    const secondPart = number.slice(8, 13);

    return `(${countryCode}) ${areaCode}-${firstPart}-${secondPart}`;
  }

  togglePhoneNumber() {
    this.showFullPhoneNumber = !this.showFullPhoneNumber;
  }
}
