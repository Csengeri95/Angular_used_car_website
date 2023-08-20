import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TranslationService } from './../../translation.service';
import { Observable, Subject, Subscription } from 'rxjs';

interface FeaturesType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['../stepper.component.css'],
})
export class StepFourComponent implements OnInit {
  @Input() additionalData!: FormGroup;
  @Input() basicData!: FormGroup;
  @Input() personal!: FormGroup;
  @Input() product!: FormGroup;
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter<any>();
  announcer: LiveAnnouncer;
  private dataSubscription: Subscription | undefined;
  private dataLoadedSubject = new Subject<boolean>();

  features: FeaturesType[] = [];
  selectedFileName: string[] = [];
  selectedFiles: File[] = [];
  maxUploads: number = 3;
  errorMessage: string = '';
  maxTitleLength: number = 12;
  featuresMore: string = '';

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    public translationService: TranslationService
  ) {
    this.announcer = liveAnnouncer;
  }

  async ngOnInit(): Promise<void> {
    this.dataSubscription = this.translateOptions().subscribe({
      next: (translations) => {
        this.features = translations['features'] as FeaturesType[];
        this.dataLoadedSubject.next(true);
      },
      error: (error) => {
        console.log(error);
      },
      complete() {},
    });
    this.dataLoadedSubject.subscribe((dataLoaded: boolean) => {
      if (dataLoaded) {
        this.translate();
      }
    });
  }

  getSelectedFeatures(): string {
    const selectedFeatures: any =
      this.additionalData.get('featuresCtrl')!.value || [];
    const totalSelected = selectedFeatures.length;

    if (totalSelected === 1) {
      const selectedViewValue = this.features.find(
        (a) => a.value === selectedFeatures[0]
      );
      return selectedViewValue ? selectedViewValue.viewValue : '';
    } else {
      const selectedViewValues = selectedFeatures
        .map((featureValue: string) => {
          const selectedViewValue = this.features.find(
            (a) => a.value === featureValue
          );
          return featureValue ? selectedViewValue?.viewValue : '';
        })
        .filter((view: string) => view !== '');

      if (selectedViewValues.length > 1) {
        return `${selectedViewValues[0]} (+${selectedViewValues.length - 1} ${
          this.featuresMore
        })`;
      } else {
        return selectedViewValues[0];
      }
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target?.files;

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];

      if (file.size > 5000000) {
        this.translationService
          .getTranslation('uploadErrorMessageSize')
          .subscribe((translatedErrorMessage: string) => {
            this.errorMessage = translatedErrorMessage;
          });
        return;
      } else if (
        !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
      ) {
        this.translationService
          .getTranslation('uploadErrorMessageFormat')
          .subscribe((translatedErrorMessage: string) => {
            this.errorMessage = translatedErrorMessage;
          });
        return;
      } else if (this.selectedFileName.length >= this.maxUploads) {
        this.translationService
          .getTranslation('uploadErrorMessageLength')
          .subscribe((translatedErrorMessage: string) => {
            this.errorMessage = translatedErrorMessage;
          });
        return;
      }

      this.selectedFileName.push(file.name);

      this.selectedFiles.push(file);
    }

    this.additionalData.get('imagesCtrl')?.setValue(this.selectedFiles);

    this.errorMessage = '';
  }

  remove(fileName: string): void {
    const index = this.selectedFileName.indexOf(fileName);
    if (index >= 0) {
      this.selectedFileName.splice(index, 1);
      this.announcer.announce(`Removed ${fileName}`);
    }
  }

  submitForm() {
    if (this.isFormVaild()) {
      this.formSubmitted.emit(this.additionalData.value);
    }
  }

  private isFormVaild(): boolean {
    return (
      this.additionalData.valid &&
      this.personal.valid &&
      this.product.valid &&
      this.basicData.valid
    );
  }

  translateOptions(): Observable<any> {
    return this.translationService.translate.get(['features', 'featuresMore']);
  }

  translate(): void {
    this.translationService.getTranslation('featuresMore').subscribe({
      next: (translation) => {
        this.featuresMore = translation;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
