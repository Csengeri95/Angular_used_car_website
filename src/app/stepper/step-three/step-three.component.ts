import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslationService } from './../../translation.service';
import { Subscription, Subject, Observable, from } from 'rxjs';

interface FuelType {
  value: string;
  viewValue: string;
}
interface TransType {
  value: string;
  viewValue: string;
}

interface FeaturesType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['../stepper.component.css'],
})
export class StepThreeComponent implements OnInit {
  @Input() basicData!: FormGroup;
  @Input() additionalData!: FormGroup;
  @Output() nextStepData: EventEmitter<any> = new EventEmitter<any>();
  private dataSubscription: Subscription | undefined;
  private dataLoadedSubject = new Subject<boolean>();

  fuelTypes: FuelType[] = [];
  transTypes: TransType[] = [];

  transTypesFiltered: TransType[] = [];
  validYears: number[] = [];
  engineSizeLabel$: Observable<string> | undefined;

  constructor(public translationService: TranslationService) {
    const currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= currentYear - 100; i--) {
      this.validYears.push(i);
    }
  }
  async ngOnInit(): Promise<void> {
    this.dataSubscription = this.translateOptions().subscribe({
      next: (translations) => {
        this.fuelTypes = translations['fuelTypes'] as FuelType[];
        this.transTypes = translations['transTypes'] as TransType[];
        this.dataLoadedSubject.next(true);
      },
      error: (error) => {
        console.log(error);
      },
      complete() {},
    });

    this.dataLoadedSubject.subscribe((dataLoaded: boolean) => {
      if (dataLoaded) {
        this.getEngineSizeLabel();
      }
    });
  }

  filteredElectronic(): TransType[] {
    return (this.transTypesFiltered = this.transTypes.filter((transType) => {
      return transType.value === 'ev' || transType.value === 'none';
    }));
  }

  filteredNonElectronic(): TransType[] {
    return (this.transTypesFiltered = this.transTypes.filter((transType) => {
      return transType.value !== 'ev' && transType.value !== 'none';
    }));
  }

  getEngineSizeLabel(): Observable<string> {
    const fuelType = this.basicData.get('fuelTypeCtrl')?.value;

    if (fuelType === 'hybrid' || fuelType === 'electronic') {
      return this.translationService.getTranslation(
        'engineSizeElectronic'
      );
    } else {
      return this.translationService.getTranslation(
        'engineSizeNonElectronic'
      );
    }
  }

  onStepThreeNext() {
    if (this.basicData.valid) {
      this.nextStepData.emit(this.basicData.value);
    }
  }

  translateOptions(): Observable<any> {
    return this.translationService.translate.get([
      'fuelTypes',
      'transTypes',
      'features',
    ]);
  }
}
