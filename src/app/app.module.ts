import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { IngresoComponent } from './components/ingreso/ingreso.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';

import {APP_ROUTING} from './app.routes';
// se importan rutas

@NgModule({
  declarations: [
    AppComponent,
    IngresoComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpModule,
    APP_ROUTING
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
