import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from 'primeng/dialog';
import { LogoComponent } from './logo/logo.component';
import { StepperComponent } from './stepper/stepper.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StepOneComponent } from './stepper/step-one/step-one.component';
import { StepTwoComponent } from './stepper/step-two/step-two.component';
import { StepThreeComponent } from './stepper/step-three/step-three.component';
import { StepFourComponent } from './stepper/step-four/step-four.component';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { HomeComponent } from './pages/home/home.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SiderbarComponent } from './pages/home/siderbar/siderbar.component';
import { SelectedcarComponent } from './pages/selectedcar/selectedcar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CardDetailsComponent } from './pages/selectedcar/card-details/card-details.component';
import { GalleriaModule } from 'primeng/galleria';
import { GalleryComponent } from './pages/selectedcar/gallery/gallery.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsComponent } from './pages/selectedcar/tabs/tabs.component';
import { MatListModule } from '@angular/material/list';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { OptionCardComponent } from './pages/selectedcar/option-card/option-card.component';
import { RecommendationCardComponent } from './pages/selectedcar/recommendation-card/recommendation-card.component';
import { TranslationService } from './translation.service';
import { MatPaginatorIntlCro } from './pages/home/myMatPaginatorIntl';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LogoComponent,
    StepperComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    HomeComponent,
    SiderbarComponent,
    SelectedcarComponent,
    NotFoundComponent,
    CardDetailsComponent,
    GalleryComponent,
    TabsComponent,
    OptionCardComponent,
    RecommendationCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    DialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    MatToolbarModule,
    MatChipsModule,
    FlexLayoutModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    MatCardModule,
    MatGridListModule,
    MatTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'hu',
    }),
    GalleriaModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatListModule,
    MatPaginatorModule,
    BreadcrumbModule,
  ],
  providers: [
    CurrencyPipe,
    MessageService,

    {
      provide: MatPaginatorIntl,
      useFactory: (translationService: TranslationService) =>
        new MatPaginatorIntlCro(translationService),
      deps: [TranslationService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
