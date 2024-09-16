import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { ListarContratosComponent } from './components/supervisor/listar-contratos/listar-contratos.component';
import { InformeSatisfaccionComponent } from './components/supervisor/informe_seguimiento/informe-satisfaccion.component';
import { APP_BASE_HREF } from '@angular/common';
import { getSingleSpaExtraProviders } from 'single-spa-angular';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RevisionCumplidosContratacionComponent } from './components/contratacion/revision-cumplidos-contratacion/revision-cumplidos-contratacion.component';
import { RevisionCumplidosOrdenadorComponent } from './components/ordenador/revision-cumplidos-ordenador/revision-cumplidos-ordenador.component';

export const routes: Routes = [
  {
    path:'supervisor/subir-soportes',
    component: ListarContratosComponent,
  },
  {
    path: 'informe-seguimiento/:cumplidoId',
    component: InformeSatisfaccionComponent,
  },
  {
    path: 'contratacion/aprobacion-pago',
    component: RevisionCumplidosContratacionComponent,
  },
  {
    path: 'ordenador/aprobacion-pago',
    component: RevisionCumplidosOrdenadorComponent,
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
