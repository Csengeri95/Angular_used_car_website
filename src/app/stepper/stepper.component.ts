import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormDataModel } from '../form-data-model';
import { DynamoDBService } from '../dynamo-db.service';
import { TranslationService } from './../translation.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],

  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class StepperComponent {
  @Output() closeDialog: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleMenu: EventEmitter<any> = new EventEmitter<any>();
  @Output() showSuccessToast: EventEmitter<any> = new EventEmitter<any>();
  @Output() showErrorToast: EventEmitter<any> = new EventEmitter<any>();

  formData: FormDataModel = new FormDataModel();
  imageUrls: string[] = [];

  personal = this._formBuilder.group({
    nameCtrl: ['', [Validators.required]],
    emailCtrl: ['', [Validators.required, Validators.email]],
    telCtrl: ['', [Validators.pattern(/^(\+36)(20|30|31|50|70|90)[0-9]{7}$/)]],
  });
  product = this._formBuilder.group({
    typeCtrl: ['', [Validators.required]],
    car_make: ['', [Validators.required]],
    modelCtrl: ['', [Validators.required]],
    bodyTypeCtrl: ['', [Validators.required]],
    conditionCtrl: ['', [Validators.required]],
  });
  basicData = this._formBuilder.group({
    yearCtrl: ['', [Validators.required]],
    mileageCtrl: ['', [Validators.required, Validators.min(0)]],
    fuelTypeCtrl: ['', [Validators.required]],
    transTypeCtrl: ['', [Validators.required]],
    engineSizeCtrl: ['', [Validators.required, Validators.min(0)]],
    colorCtrl: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ ]+$'),
      ],
    ],
  });

  additionalData = this._formBuilder.group({
    featuresCtrl: ['', [Validators.required]],
    /** */
    locationCtrl: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ ]+$'),
      ],
    ],
    priceCtrl: [null, [Validators.required, Validators.min(0)]],
    imagesCtrl: ['', []],
  });
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private dynamoDBService: DynamoDBService,
    public translationService: TranslationService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  onStepOneNext(data: any) {
    this.formData = { ...this.formData, ...data };
  }

  onStepTwoNext(data: any) {
    this.formData = { ...this.formData, ...data };
  }

  onStepThreeNext(data: any) {
    this.formData = { ...this.formData, ...data };
  }

  resetFormControl(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((controlName) => {
      const control = formGroup.get(controlName);

      control?.setValue(null);
      control?.setErrors(null);
    });
  }

  async onFormSubmitted(data: FormDataModel) {
    const imageUrl = await this.dynamoDBService.uploadImages(data.imagesCtrl);

    const errors = imageUrl.some((result) => !result.success);

    if (errors) {
      this.showErrorToast.emit();
    } else {
      this.formData = {
        ...this.formData,
        ...data,
        imagesCtrl: imageUrl,
      };

      const customObserver = {
        next: (response: any) => {
          this.showSuccessToast.emit();
          this.closeDialog.emit();
          this.toggleMenu.emit();
          this.resetFormControl(this.personal);
          this.resetFormControl(this.product);
          this.resetFormControl(this.basicData);
          this.resetFormControl(this.additionalData);
        },
        error: (error: any) => {
          this.showErrorToast.emit();
        },
        complete: () => {
          this.dynamoDBService.getDynamoDBItems();
        },
      };

      this.dynamoDBService.addFormData(this.formData).subscribe(customObserver);
    }
  }

  onStepSelectionChange(event: any) {
    const selectedStepIndex = event.selectedIndex;

    switch (selectedStepIndex) {
      case 1:
        this.onStepOneNext(this.personal.value);
        break;
      case 2:
        this.onStepTwoNext(this.product.value);
        break;
      case 3:
        this.onStepThreeNext(this.basicData.value);
    }
  }
}
