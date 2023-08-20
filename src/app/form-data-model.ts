import { Guid } from 'guid-typescript';

export class FormDataModel {
  car_id: string = '';
  nameCtrl: string = '';
  emailCtrl: string = '';
  telCtrl: string = '';
  typeCtrl: string = '';
  car_make: string = '';
  modelCtrl: string = '';
  bodyTypeCtrl: string = '';
  conditionCtrl: string = '';
  yearCtrl: number = 0;
  mileageCtrl: number = 0;
  fuelTypeCtrl: string = '';
  transTypeCtrl: string = '';
  engineSizeCtrl: number = 0;
  colorCtrl: string = '';
  featuresCtrl: string[] = [];
  locationCtrl: string = '';
  priceCtrl: number = 0;
  imagesCtrl: any;
  release_date!: Date;
  constructor() {
    this.car_id = Guid.create().toString();
  }
}
