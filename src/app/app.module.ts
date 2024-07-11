import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table'
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatDialogModule} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TablaCargaSoportesComponent } from './components/carga-soportes/tabla-carga-soportes/tabla-carga-soportes.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {MatSelectModule} from '@angular/material/select';
import { ModalCargaSoprotesComponent } from './components/carga-soportes/modal-carga-soprotes/modal-carga-soprotes.component'; 
import { TablaAproabacionPagoComponent } from './components/aprobacion-soportes/tabla-aprobacion-pago/tabla-aproabacion-pago.component';
import { ModalVerSoportesComponent } from './components/aprobacion-soportes/modal-ver-soportes/modal-ver-soportes.component';

@NgModule({
  declarations: [
    AppComponent,
    TablaCargaSoportesComponent,
    ModalCargaSoprotesComponent,
    TablaAproabacionPagoComponent,
    ModalVerSoportesComponent,
  ],
  imports: [
 
  BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    BrowserAnimationsModule,
    SweetAlert2Module ,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
