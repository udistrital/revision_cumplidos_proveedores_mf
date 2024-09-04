import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { TablaCargaSoportesComponent } from './components/carga-soportes/tabla-carga-soportes/tabla-carga-soportes.component';
import { InformeSatisfaccionComponent } from './components/informe_seguimiento/informe-satisfaccion.component';
import { APP_BASE_HREF } from '@angular/common';
import { getSingleSpaExtraProviders } from 'single-spa-angular';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TablaAprobacionPagoComponent } from './components/aprobacion-soportes/contratacion/tabla-aprobacion-pago/tabla-aprobacion-pago.component';
import { TablaAprobacionPagoOrdenadorComponent } from './components/aprobacion-soportes/ordenador/tabla-aprobacion-pago/tabla-aprobacion-pago-ordenador.component';

export const routes: Routes = [
  {
    path:'supervisor/subir-soportes',
    component: TablaCargaSoportesComponent,
  },
  {
    path: 'informe-seguimiento/:cumplidoId',
    component: InformeSatisfaccionComponent,
  },
  {
    path: 'contratacion/aprobacion-pago',
    component: TablaAprobacionPagoComponent,
  },
  {
    path: 'ordenador/aprobacion-pago',
    component: TablaAprobacionPagoOrdenadorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    provideRouter(routes),
    { provide: APP_BASE_HREF, useValue: '/pages/'},
    getSingleSpaExtraProviders(),
    provideHttpClient(withFetch())]
})
export class AppRoutingModule { }
