import { Component, Input } from '@angular/core';
import { FormDataModel } from 'src/app/form-data-model';
import { formatPrice, getViewValue, format } from 'src/utils/utils';
import { TranslationService } from 'src/app/translation.service';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  @Input() car: FormDataModel | undefined;

  constructor(public translationService: TranslationService) {}

  formatNumber(price: number): string {
    return formatPrice(price);
  }

  getValue(array: string, value: any): string {
    return getViewValue(this.translationService, array, value);
  }

  transformValue(number: number): string {
    return format(number);
  }

  date(date: Date): string {
    const dateObject = new Date(date);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const dateFormatted = `${year}-${month}-${day}`;

    return `${dateFormatted}`;
  }
}
