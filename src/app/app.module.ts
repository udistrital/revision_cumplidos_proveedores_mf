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
import { FormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import { VisualizarSoportesComponent } from './components/subir_soporte/visualizar-soportes/visualizar-soportes.component';
import { SoporteCumplidoComponent } from './components/subir_soporte/soporte-cumplido/soporte-cumplido.component';
import { CargarModalComponent } from './components/subir_soporte/cargar-modal/cargar-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    SubirSoporteComponent,
    VisualizarSoportesComponent,
    SoporteCumplidoComponent,
    CargarModalComponent
  ],
  imports: [
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
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    FormsModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
