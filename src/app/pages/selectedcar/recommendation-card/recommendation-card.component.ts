import { DynamoDBService } from './../../../dynamo-db.service';
import { Component } from '@angular/core';
import {
  formatPrice,
  getViewValue,
  navigateToSelectedCar,
} from 'src/utils/utils';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/translation.service';

@Component({
  selector: 'app-recommendation-card',
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.css'],
})
export class RecommendationCardComponent {
  constructor(
    public dynamoDBService: DynamoDBService,
    public router: Router,
    public translationService: TranslationService
  ) {}

  formatNumber(price: number): string {
    return formatPrice(price);
  }

  selectItem(type: string, car_make: string, model: string, car_id: string) {
    navigateToSelectedCar(this.router, type, car_make, model, car_id);
  }
}
