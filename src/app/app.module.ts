import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { MatGridListModule } from '@angular/material/grid-list';
import { InformeSatisfaccionComponent } from './components/supervisor/informe_seguimiento/informe-satisfaccion.component';
import { InformacionContratoComponent } from './components/supervisor/informe_seguimiento/informacion-contrato/informacion-contrato.component';
import { FormularioInformeSatisfaccionComponent } from './components/supervisor/informe_seguimiento/formulario-informe-satisfaccion/formulario-informe-satisfaccion';
import { MatTableModule } from '@angular/material/table';
import { ListarContratosComponent } from './components/supervisor/listar-contratos/listar-contratos.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ModalListarCumplidosComponent } from './components/supervisor/modal-listar-cumplidos/modal-listar-cumplidos.component';
import { RevisionCumplidosOrdenadorComponent } from './components/ordenador/revision-cumplidos-ordenador/revision-cumplidos-ordenador.component';
import { RevisionCumplidosContratacionComponent } from './components/contratacion/revision-cumplidos-contratacion/revision-cumplidos-contratacion.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SafeUrlPipe } from './pipes/safeurl.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { CardSoporteComponent } from './components/general-components/card-soporte/card-soporte.component';
import { ModalSoportesCumplidoComponent } from './components/general-components/modal-soportes-cumplido/modal-soportes-cumplido.component';
import { FormSoporteComponent } from './components/general-components/form-soporte/form-soporte.component';
import { ModalVisualizarSoporteComponent } from './components/general-components/modal-visualizar-soporte/modal-visualizar-soporte.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TablaComponent } from './components/general-components/tabla/tabla.component'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    environment.apiUrl + 'assets/i18n/',
    '.json'
  );
}

@NgModule({
  declarations: [
    AppComponent,
    InformeSatisfaccionComponent,
    InformacionContratoComponent,
    FormularioInformeSatisfaccionComponent,
    ListarContratosComponent,
    ModalListarCumplidosComponent,
    RevisionCumplidosContratacionComponent,
    RevisionCumplidosOrdenadorComponent,
    SafeUrlPipe,
    CardSoporteComponent,
    ModalSoportesCumplidoComponent,
    FormSoporteComponent,
    ModalVisualizarSoporteComponent,
    TablaComponent,
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
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
