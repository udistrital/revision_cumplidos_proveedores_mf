import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SubirSoporteComponent } from './components/subir_soporte/subir-soporte/subir-soporte.component'
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import { VisualizarSoportesComponent } from './components/subir_soporte/visualizar-soportes/visualizar-soportes.component';
import { SoporteCumplidoComponent } from './components/subir_soporte/soporte-cumplido/soporte-cumplido.component';
import { CargarModalComponent } from './components/subir_soporte/cargar-modal/cargar-modal.component';
import { ComponentePrincipalComponent } from './components/informe_seguimiento/componente-principal/componente-principal.component';
import { InformacionContratoComponent } from './components/informe_seguimiento/informacion-contrato/informacion-contrato.component';
import { FormularioInformeSeguimientoComponent } from './components/informe_seguimiento/formulario-informe-seguimiento/formulario-informe-seguimiento.component';
import {MatTableModule} from '@angular/material/table'
import { TablaCargaSoportesComponent } from './components/carga-soportes/tabla-carga-soportes/tabla-carga-soportes.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ModalCargaSoprotesComponent } from './components/carga-soportes/modal-carga-soprotes/modal-carga-soprotes.component';
import { TablaAproabacionPagoComponent } from './components/aprobacion-soportes/ordenador/tabla-aprobacion-pago/tabla-aproabacion-pago.component';
import { TablaAprobacionPagoComponent } from './components/aprobacion-soportes/contratacion/tabla-aprobacion-pago/tabla-aprobacion-pago.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { VerSoporteModalComponent } from './components/subir_soporte/ver-soporte-modal/ver-soporte-modal.component';
import { SafeUrlPipe } from './pipes/safeurl.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ModalVerSoporteComponent } from './components/modal-ver-soporte/modal-ver-soporte.component';
import { ModalListarSoportes } from './components/modal-listar-soportes/modal-listar-soportes.component';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.apiUrl + 'assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    SubirSoporteComponent,
    VisualizarSoportesComponent,
    SoporteCumplidoComponent,
    CargarModalComponent,
    ComponentePrincipalComponent,
    InformacionContratoComponent,
    FormularioInformeSeguimientoComponent,
    TablaCargaSoportesComponent,
    ModalCargaSoprotesComponent,
    TablaAproabacionPagoComponent,
    TablaAprobacionPagoComponent,
    VerSoporteModalComponent,
    SafeUrlPipe,
    ModalVerSoporteComponent,
    ModalListarSoportes
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    FormsModule,
    MatGridListModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatTableModule,
    SweetAlert2Module,
    HttpClientModule,
    MatSnackBarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
