import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DemoMaterialModule} from './material-module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';


import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { EasycalcFormComponent } from './easycalc-form/easycalc-form.component';

@NgModule({  
  imports:      [ BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DemoMaterialModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule ],
  declarations: [ AppComponent, HelloComponent, EasycalcFormComponent ],
  bootstrap:    [ AppComponent ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class AppModule { }

