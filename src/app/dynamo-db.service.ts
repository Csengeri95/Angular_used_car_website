import { Injectable } from '@angular/core';
import AWS from 'aws-sdk';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { FormDataModel } from './form-data-model';
import { HttpClient } from '@angular/common/http';

interface UploadResult {
  imageUrl: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DynamoDBService {
  private dynamodb: any;
  private docClient: AWS.DynamoDB.DocumentClient | undefined;

  private params = {
    TableName: 'used_cars_database',
  };
  data: FormDataModel[] = [];
  filteredData: FormDataModel[] = [];
  firstTenRecommendedCars: FormDataModel[] = [];
  private filteredDataSubject = new BehaviorSubject<FormDataModel[]>([]);
  filteredDataChange = this.filteredDataSubject.asObservable();

  constructor(private http: HttpClient) {
    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.Credentials({
        accessKeyId: import.meta.env['NG_APP_ACCESS_KEY_ID'],
        secretAccessKey: import.meta.env['NG_APP_SECRET_ACCESS_KEY'],
      }),
    });

    this.dynamodb = new AWS.DynamoDB();
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  readData(): Observable<any> {
    return new Observable((observer) => {
      this.docClient?.scan(this.params, (err, data) => {
        if (err) {
          observer.error(err);
        } else {
          const items = data.Items?.map((item) => {
            item['release_date'] = new Date(item['release_date']);
            return item;
          });
          observer.next(items);
        }
      });
    });
  }

  async uploadImages(images: File[]): Promise<UploadResult[]> {
    if (!images || images.length === 0) {
      return [];
    }
    const s3 = new AWS.S3();

    const upload = images.map(async (image, index) => {
      const key = `image_${index + 1}_${Date.now()}_${image.name}`;
      const params = {
        Bucket: import.meta.env['NG_APP_BUCKET_NAME'],
        Key: key,
        Body: image,
        ContentType: image.type,
      };

      try {
        const data = await s3.upload(params).promise();
        return { imageUrl: data.Location, success: true };
      } catch (error) {
        return { imageUrl: '', success: false };
      }
    });

    const uploadResult = await Promise.all(upload);

    return uploadResult;
  }

  addFormData(formData: any): Observable<any> {
    return new Observable((observer) => {
      const date = new Date().toISOString();
      formData.release_date = date;
      const params = {
        TableName: this.params.TableName,
        Item: formData,
      };

      this.docClient?.put(params, (err, data) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(data);
          observer.complete();
        }
      });
    });
  }

  getDynamoDBItems() {
    this.readData().subscribe({
      next: (item: FormDataModel[]) => {
        this.data = item;

        this.applyFilters({});
      },
      error: (error) => {
        console.log('Error fetching data:', error);
      },
      complete: () => {
        console.log('Data fetching completed!');
      },
    });
  }

  applyFilters(filteredCriteria: any) {
    const { selectedCarMake, selectedCarModel, minPrice, maxPrice } =
      filteredCriteria;

    if (selectedCarMake || selectedCarModel || minPrice || maxPrice) {
      this.filteredData = this.data.filter((car) => {
        const isCarMakeMatch =
          !selectedCarMake || car.car_make === selectedCarMake;
        const isCarModelMatch =
          !selectedCarModel || car.modelCtrl === selectedCarModel;
        const isPriceInRange =
          (!minPrice || car.priceCtrl >= minPrice) &&
          (!maxPrice || car.priceCtrl <= maxPrice);

        return isCarMakeMatch && isCarModelMatch && isPriceInRange;
      });
    } else {
      this.filteredData = [...this.data];
    }
    this.filteredDataSubject.next(this.filteredData);
  }

  typeRecommend(type: string, car_id: string): FormDataModel[] {
    if (this.data.length > 0) {
      const recommendedCarsType = this.data.filter(
        (a: FormDataModel) => a.typeCtrl === type && a.car_id !== car_id
      );
      this.firstTenRecommendedCars = recommendedCarsType.slice(0, 10);

      return this.firstTenRecommendedCars;
    } else {
      return [];
    }
  }

  filterByProperty(
    property: keyof FormDataModel,
    value: string
  ): Observable<FormDataModel[]> {
    if (this.data.length > 0) {
      const filteredData = this.data.filter(
        (a: FormDataModel) => a[property] === value
      );
      return of(filteredData);
    } else {
      return of([...this.data]);
    }
  }
}
