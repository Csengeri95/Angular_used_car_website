import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { TranslationService } from 'src/app/translation.service';

@Injectable()
export class MatPaginatorIntlCro extends MatPaginatorIntl {
  constructor(private translationService: TranslationService) {
    super();

    this.translationService.currentLang$.subscribe((lang) => {
      this.itemsPerPageLabel =
        lang === 'hu' ? 'Elem laponként' : 'Items per page';
      this.changes.next();
    });
  }
}
