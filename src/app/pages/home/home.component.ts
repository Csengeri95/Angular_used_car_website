import { TranslationService } from './../../translation.service';
import { DynamoDBService } from './../../dynamo-db.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { SiderbarComponent } from './siderbar/siderbar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { formatPrice, navigateToSelectedCar } from 'src/utils/utils';
import { PageEvent } from '@angular/material/paginator';
import { Subscription, Subject } from 'rxjs';
import { FormDataModel } from 'src/app/form-data-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private dataSubscription: Subscription | undefined;
  private dataLoadedSubject = new Subject<boolean>();
  public searchPerformed: boolean = false;
  @ViewChild(SiderbarComponent) siderbarComponent!: SiderbarComponent;
  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent: PageEvent = new PageEvent();
  isLoading: boolean = true;
  shouldShowResetChip: boolean = false;

  constructor(
    public dynamoDBService: DynamoDBService,
    public translationService: TranslationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.dynamoDBService.filteredDataChange.subscribe(
      (filteredData: FormDataModel[]) => {
        this.length = filteredData.length;
      }
    );

    this.activatedRoute.queryParams.subscribe((params) => {
      this.shouldShowResetChip = params['filterApplied'] === 'true';
    });

    this.dataSubscription = this.dynamoDBService.readData().subscribe({
      next: (data: FormDataModel[]) => {
        if (data.length > 0) {
          this.dynamoDBService.data = data;
          this.dataLoadedSubject.next(true);
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });

    this.dataLoadedSubject.subscribe((dataLoaded: boolean) => {
      if (dataLoaded) {
        this.length = this.dynamoDBService.filteredData.length;

        const storedCriteria = localStorage.getItem('filteredCriteria');

        if (storedCriteria !== null) {
          this.shouldShowResetChip = true;
        }
      }
    });
  }

  formatNumber(price: number): string {
    return formatPrice(price);
  }

  onSearchPerformed(searchPerformed: boolean) {
    this.searchPerformed = searchPerformed;
  }

  onShouldShowResetChip(shouldShowResetChip: boolean) {
    this.shouldShowResetChip = shouldShowResetChip;
  }

  resetFilters() {
    this.siderbarComponent.resetFilters();
  }

  selectItem(type: string, car_make: string, model: string, car_id: string) {
    navigateToSelectedCar(this.router, type, car_make, model, car_id);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.length = this.dynamoDBService.filteredData.length;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage(event: any): void {
    localStorage.removeItem('filteredCriteria');
  }
}
