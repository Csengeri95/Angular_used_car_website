import { TranslationService } from './../../translation.service';
import { DynamoDBService } from './../../dynamo-db.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDataModel } from 'src/app/form-data-model';
import { MessageService } from 'primeng/api';
import { Subscription, Subject, firstValueFrom, filter } from 'rxjs';
import { formatPrice, getViewValue } from 'src/utils/utils';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-selectedcar',
  templateUrl: './selectedcar.component.html',
  styleUrls: ['./selectedcar.component.css'],
})
export class SelectedcarComponent implements OnInit {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;
  private dataSubscription: Subscription | undefined;
  private dataLoadedSubject = new Subject<boolean>();
  isLoading: boolean = true;

  constructor(
    private messageService: MessageService,
    public translationService: TranslationService,
    private route: ActivatedRoute,
    private router: Router,
    public dynamoDBService: DynamoDBService
  ) {}

  car: FormDataModel | undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const carId = params.get('id');
      this.loadCarDetails(carId);
    });
  }

  private loadCarDetails(carId: string | null): void {
    if (carId) {
      this.dynamoDBService.readData().subscribe({
        next: async (data: FormDataModel[]) => {
          const selectedCar = data.find(
            (car: FormDataModel) => car.car_id === carId
          );
          if (selectedCar) {
            this.car = selectedCar;
            this.isLoading = false;
            this.dynamoDBService.typeRecommend(
              selectedCar.typeCtrl,
              selectedCar.car_id
            );
            this.items = [
              {
                label: this.getValue('types', selectedCar?.typeCtrl),
                command: () =>
                  this.navigateToHome('typeCtrl', selectedCar?.typeCtrl),
              },
              {
                label: selectedCar.car_make,
                command: () =>
                  this.navigateToHome('car_make', selectedCar.car_make),
              },
              {
                label: selectedCar.modelCtrl,
                command: () =>
                  this.navigateToHome('modelCtrl', selectedCar.modelCtrl),
              },
            ];

            this.home = { icon: 'pi pi-home', routerLink: '/home' };
          } else {
            this.router.navigate(['/not-found']);
          }
        },
        error: (error) => {
          this.showErrorToast();
          this.router.navigate(['/not-found']);
        },
        complete: () => {},
      });
    }
  }

  private navigateToHome(property: any, value: string | undefined) {
    if (value) {
      this.dynamoDBService
        .filterByProperty(property, value)
        .subscribe((filteredData) => {
          this.dynamoDBService.filteredData = filteredData;
          this.router.navigate(['home'], {queryParams:{filterApplied:'true'}});
        });
    }
  }

  async showErrorToast() {
    const errorMessage = await firstValueFrom(
      this.translationService.getTranslation('errorMessage')
    );
    const failure = await firstValueFrom(
      this.translationService.getTranslation('failure')
    );

    this.messageService.add({
      key: 'tc',
      severity: 'error',
      summary: failure,
      detail: errorMessage,
    });
  }

  getValue(array: string, value: any): string {
    return getViewValue(this.translationService, array, value);
  }

  formatNumber(price: number): string {
    return formatPrice(price);
  }

  itemClicked(event: { item: any }) {
    console.log(event.item);
  }
}
