import { Component, Input } from '@angular/core';
import { FormDataModel } from 'src/app/form-data-model';

interface Responsive {
  breakpoint: string;
  numVisible: number;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  @Input() car: FormDataModel | undefined;
  showFullscreenImage: boolean = false;
  selectedImageUrl: string = '';
  selectedImageIndex: number = 0;

  responsiveOptions: Responsive[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor() {}

  showImageFullscreen(imageUrl: string, clickedImage: any) {
    const index = this.car?.imagesCtrl.findIndex(
      (item: any) => item === clickedImage
    );
    if (index !== -1) {
      this.selectedImageUrl = imageUrl;
      this.selectedImageIndex = index;
      this.showFullscreenImage = true;
    }
  }
}
