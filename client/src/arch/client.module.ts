import { BrowserModule } from '@angular/platform-browser';
import { ClientsPageComponent } from '../app/clients-page/clients-page.component';
/* Angular material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
  ],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientModule { }
