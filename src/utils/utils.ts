import { TranslationService } from './../app/translation.service';
import { Router } from '@angular/router';

export function getViewValue(
  translationService: TranslationService,
  array: string,
  value: any
): string {
  const currentLang = translationService.translate.currentLang;
  return translationService.getViewValueFromArray(array, value, currentLang);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumSignificantDigits: 3,
  }).format(price);
}

export function format(number: number): string {
  return new Intl.NumberFormat('hu-HU', {
    maximumSignificantDigits: 3,
  }).format(number);
}

export function navigateToSelectedCar(
  router: Router,
  type: string,
  car_make: string,
  model: string,
  car_id: string,
): void {
  router.navigate(['selectedcar', type, car_make, model, car_id]);
}
