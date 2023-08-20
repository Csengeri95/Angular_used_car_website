import { TranslationService } from './../../../translation.service';
import { FormDataModel } from 'src/app/form-data-model';
import { DynamoDBService } from './../../../dynamo-db.service';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface Cars {
  makes: string;
  quantity: number;
}

interface Models {
  models: string;
  quantity: number;
}

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.css'],
})
export class SiderbarComponent implements OnInit, OnDestroy {
  cars: Cars[] = [];
  models: Models[] = [];
  private dataSubscription: Subscription | undefined;
  private dataLoadedSubject = new Subject<boolean>();
  types: Type[] = [];
  @Output() searchPerformed: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Output() shouldShowResetChip: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  maxPriceLessThanMinValidator(
    group: FormGroup
  ): { [key: string]: any } | null {
    const minPrice = group.get('minPriceCtrl')?.value;
    const maxPrice = group.get('maxPriceCtrl')?.value;

    if (minPrice !== null && maxPrice !== null && maxPrice < minPrice) {
      group.get('maxPriceCtrl')?.setErrors({ maxPriceLessThanMin: true });
      return { maxPriceLessThanMin: true };
    } else {
      group.get('maxPriceCtrl')?.setErrors(null);
      return null;
    }
  }

  sidebar = this._formBuilder.group(
    {
      car_make: ['', []],
      modelCtrl: ['', []],
      minPriceCtrl: [null, [Validators.min(0)]],
      maxPriceCtrl: [null, [Validators.min(0)]],
    },
    { validators: this.maxPriceLessThanMinValidator }
  );

  constructor(
    private dynamoDBService: DynamoDBService,
    private _formBuilder: FormBuilder,
    public translationService: TranslationService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataSubscription = this.dynamoDBService.readData().subscribe({
      next: (data: FormDataModel[]) => {
        if (data.length > 0) {
          this.dynamoDBService.data = data;
          this.dataLoadedSubject.next(true);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });

    this.dataLoadedSubject.subscribe((dataLoaded: boolean) => {
      if (dataLoaded) {
        this.loadCars();
        this.loadModels();
      }
      const storedCriteria = localStorage.getItem('filteredCriteria');
      if (dataLoaded && storedCriteria) {
        const parsedStoredCriteria = JSON.parse(storedCriteria);

        this.sidebar
          .get('car_make')
          ?.setValue(parsedStoredCriteria.selectedCarMake);
        this.sidebar
          .get('modelCtrl')
          ?.setValue(parsedStoredCriteria.selectedCarModel);
        this.sidebar
          .get('minPriceCtrl')
          ?.setValue(parsedStoredCriteria.minPrice);
        this.sidebar
          .get('maxPriceCtrl')
          ?.setValue(parsedStoredCriteria.maxPrice);
        this.loadModels();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.dataLoadedSubject.complete();
  }

  loadCars() {
    if (this.dynamoDBService.data.length > 0) {
      const carMakes = Array.from(
        new Set(
          this.dynamoDBService.data.map((item: FormDataModel) => item.car_make)
        )
      );
      carMakes.sort((a: string, b: string) => a.localeCompare(b));

      this.cars = carMakes.map((make: string) => ({
        makes: make,
        quantity: this.dynamoDBService.data.filter(
          (item) => item.car_make === make
        ).length,
      }));
    }
  }

  loadModels() {
    const selectedCarMake = this.sidebar.get('car_make')?.value;

    if (!selectedCarMake || selectedCarMake === undefined) {
      this.models = [];
      return;
    }

    if (selectedCarMake) {
      const modelsForSelectedMake = this.dynamoDBService.data.filter(
        (item: FormDataModel) => item.car_make === selectedCarMake
      );

      const uniqueModels = Array.from(
        new Set(modelsForSelectedMake.map((item) => item.modelCtrl))
      );

      this.models = uniqueModels.map((model) => ({
        models: model,
        quantity: modelsForSelectedMake.filter(
          (item) => item.modelCtrl === model
        ).length,
      }));
    } else {
      return;
    }
  }

  applyFilters() {
    const selectedCarMake = this.sidebar.get('car_make')?.value;
    const selectedCarModel = this.sidebar.get('modelCtrl')?.value;
    const minPrice = this.sidebar.get('minPriceCtrl')?.value;
    const maxPrice = this.sidebar.get('maxPriceCtrl')?.value;

    if (
      (selectedCarMake === null ||
        selectedCarMake === '' ||
        selectedCarMake === undefined) &&
      (selectedCarModel === null ||
        selectedCarModel === '' ||
        selectedCarModel === undefined) &&
      (minPrice === null || minPrice === '') &&
      (maxPrice === null || maxPrice === '')
    ) {
      return;
    }

    const filteredCriteria = {
      selectedCarMake,
      selectedCarModel,
      minPrice,
      maxPrice,
    };

    localStorage.setItem('filteredCriteria', JSON.stringify(filteredCriteria));

    this.dynamoDBService.applyFilters(filteredCriteria);
    this.searchPerformed.emit(true);
  }

  resetFilters() {
    this.sidebar.reset();
    this.models = [];
    this.dynamoDBService.applyFilters({});
    this.searchPerformed.emit(false);
    this.shouldShowResetChip.emit(false);
    localStorage.clear();
  }
}
