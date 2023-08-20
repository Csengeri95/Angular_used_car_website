import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';
import huTranslations from 'src/assets/i18n/hu.json';
import enTranslations from 'src/assets/i18n/en.json';

interface TranslationObject {
  [key: string]: any;
}
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>(
    localStorage.getItem('selectedLanguage') || 'hu'
  );
  currentLang$: Observable<string> = this.currentLangSubject.asObservable();

  constructor(public translate: TranslateService) {
    this.translate.addLangs(['en', 'hu']);
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const defaultLanguage = savedLanguage ? savedLanguage : 'hu';
    this.translate.use(defaultLanguage);

    this.translate.setTranslation('en', enTranslations);
    this.translate.setTranslation('hu', huTranslations);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem('selectedLanguage', event.lang);
      this.currentLangSubject.next(event.lang);
    });
  }

  getTranslation(key: string): Observable<string> {
    return this.translate.get(key);
  }

  getViewValueFromArray(
    itemArray: string,
    itemValue: string,
    lang: string
  ): string {
    const items: TranslationObject =
      lang === 'hu' ? huTranslations : enTranslations;

    const item = items[itemArray]?.find(
      (item: any) => item.value === itemValue
    );
    return item ? item.viewValue : '';
  }
}
