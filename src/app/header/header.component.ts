import { TranslationService } from './../translation.service';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isOpen: boolean = false;
  visible: boolean = false;

  constructor(
    private messageService: MessageService,
    public translationService: TranslationService
  ) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  async showSuccessToast() {
    const successMessage = await firstValueFrom(
      this.translationService.getTranslation('successMessage')
    );
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      detail: successMessage,
    });
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

  changeLanguage(language: string) {
    this.translationService.translate.use(language);
    this.isOpen = false;
  }
}
