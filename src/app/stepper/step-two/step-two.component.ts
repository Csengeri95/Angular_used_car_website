import { TranslationService } from './../../translation.service';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription, Subject, Observable } from 'rxjs';

interface Type {
  value: string;
  viewValue: string;
}

interface BodyType {
  value: string;
  viewValue: string;
  motor: boolean;
}

interface ConditionType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['../stepper.component.css'],
})
export class StepTwoComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  private dataLoadedSubject = new Subject<boolean>();
  @Input() product!: FormGroup;
  @Output() nextStepData: EventEmitter<any> = new EventEmitter<any>();
  @Input() hasError!: boolean;
  test: any;

  types: Type[] = [];
  bodyTypes: BodyType[] = [];
  conditions: ConditionType[] = [];

  bodyTypesFiltered: BodyType[] = [];

  constructor(public translationService: TranslationService) {}

  async ngOnInit(): Promise<void> {
    this.dataSubscription = this.translateOptions().subscribe({
      next: (translations) => {
        this.types = translations['types'] as Type[];
        this.bodyTypes = translations['bodyTypes'] as BodyType[];
        this.conditions = translations['conditions'] as ConditionType[];
        this.dataLoadedSubject.next(true);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });

    this.dataLoadedSubject.subscribe((dataLoaded: boolean) => {
      if (dataLoaded) {
        this.isNotMotorCycle();
        this.isMotorCycle();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.dataLoadedSubject.complete();
  }

  translateOptions(): Observable<any> {
    return this.translationService.translate.get([
      'types',
      'bodyTypes',
      'conditions',
    ]);
  }

  onStepTwoNext() {
    if (this.product.valid) {
      this.nextStepData.emit(this.product.value);
    }
  }

  isMotorCycle(): BodyType[] {
    return (this.bodyTypesFiltered = this.bodyTypes.filter((bodyType) => {
      return bodyType.motor == true;
    }));
  }

  isNotMotorCycle(): BodyType[] {
    const firstFiltered = this.bodyTypes.filter((bodyType) => {
      return bodyType.motor !== true;
    });

    if (this.product.get('typeCtrl')?.value !== 'motorcycle') {
      const mopedType = this.bodyTypes.find((type) => type.value === 'moped');
      if (mopedType) {
        return [...firstFiltered, mopedType];
      }
    }

    return firstFiltered;
  }
}
