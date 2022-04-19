import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginPageComponent} from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layuots/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layuots/main-layout/main-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { TabelsPageComponent } from './tabels-page/tabels-page.component';
import { PositionsPageComponent } from './positions-page/positions-page.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { PositionFormComponent } from './positions-page/position-form/position-form.component';
import { CategoryFormComponent } from './positions-page/category-form/category-form.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';
import { ClientsPageComponent } from './clients-page/clients-page.component';
import { ClientFormComponent } from './clients-page/client-form/client-form.component';
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularMaterialModule} from "../arch/angular-material.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatFormFieldModule} from "@angular/material/form-field";
import { OrderFormComponent } from './orders-page/order-form/order-form.component';
import { SelectPositionComponent } from './shared/components/select-position/select-position.component';
import { SelectClientComponent } from './shared/components/select-client/select-client.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    RegisterPageComponent,
    OverviewPageComponent,
    AnalyticsPageComponent,
    HistoryPageComponent,
    TabelsPageComponent,
    PositionsPageComponent,
    LoaderComponent,
    PositionFormComponent,
    CategoryFormComponent,
    OrdersPageComponent,
    ClientsPageComponent,
    ClientFormComponent,
    OrderFormComponent,
    SelectPositionComponent,
    SelectClientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatCardModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    MatProgressSpinnerModule,
    MatFormFieldModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
