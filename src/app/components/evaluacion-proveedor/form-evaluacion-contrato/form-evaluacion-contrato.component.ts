import { Component, Input, OnInit } from '@angular/core';
import { AsignacionEvaluador } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { Evaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/evaluacion.model';
import { Item } from 'src/app/models/evaluacion_cumplido_prov_crud/item.model';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { map } from 'rxjs';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { UnidadMedida } from 'src/app/models/unidad-medida';
import { AdministrativaAmazonService } from 'src/app/services/administrativa_amazon.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormularioPreguntas, Preguntas } from 'src/app/models/preguntas.model'
import { Clasificacion } from 'src/app/models/evaluacion_cumplido_prov_crud/clasificacion.model';
import { Router } from '@angular/router';
import { CambioEstadoAsignacionEvalacion } from 'src/app/models/evaluacion_cumplido_prov_crud/cambio_estado.asignacion_evaluador';
import { EvaluacionCumplidosProveedoresMidService } from 'src/app/services/evaluacion_cumplidos_provedores_mid.service';
import { BodyEvaluacion } from 'src/app/models/body_evaluacion.model';
import { Resultado } from 'src/app/models/evaluacion_cumplido_prov_mid/informacion-evaluacion.model';

@Component({
  selector: 'app-form-evaluacion-contrato',
  templateUrl: './form-evaluacion-contrato.component.html',
  styleUrls: ['./form-evaluacion-contrato.component.scss'],
})
export class FormEvaluacionContratoComponent implements OnInit {
  panelEvaluacion: boolean = false;
  puntajeTotal: number = 0;
  asignacionEvaluador!: AsignacionEvaluador;
  evaluacion!: Evaluacion | null;
  listaItems: Item[] = [];
  listaMedidas: UnidadMedida[] = [];
  respuestas: any[] = [];
  clasificacionId!: number;
  calificacionTexto: string = "MALO";
  valorTotalEvaluacion: number = 0;
  FormularioEvaluacion: FormGroup;
  listaPreguntas = FormularioPreguntas;
  listaClasificaciones!: Clasificacion[];
  ultimoEstadoEvaluacion!: CambioEstadoAsignacionEvalacion;
  @Input({required: true}) visualizacion: boolean = false;
  @Input() respuestasEvaluacion!: Resultado;


  constructor(
    private evaluacionCumplidosCrud: EvaluacionCumplidoProvCrudService,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
    private AdministrativaAmazonService: AdministrativaAmazonService,
    private popUpManager: PopUpManager,
    private evaluacionCumplidosMid: EvaluacionCumplidosProveedoresMidService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.FormularioEvaluacion = this.fb.group({
      observaciones: [''],
    });
  }

  displayedColumns = [
    { def: 'Identificador', header: 'Identificador' },
    { def: 'Nombre', header: 'Nombre' },
    { def: 'FichaTecnica', header: 'FichaTecnica' },
    { def: 'Unidad', header: 'Unidad' },
    { def: 'Cantidad', header: 'Cantidad' },
    { def: 'ValorUnitario', header: 'ValorUnitario' },
    { def: 'Iva', header: 'Iva' },
    { def: 'TipoNecesidad', header: 'TipoNecesidad' },
  ];

  async ngOnInit(): Promise<void> {
    this.respuestas = this.listaPreguntas.flatMap(item => item.preguntas);
    this.evaluacionCumplidoProvCrudService.asignacionEvaluador$.subscribe(
      (asignacion) => {
        if (asignacion) {
          this.asignacionEvaluador = asignacion;
          this.evaluacion = asignacion.EvaluacionId;
        }
      }
    );
    await this.obtenerListaClasificaciones();
    if (this.visualizacion){
      this.listaPreguntas = await this.actualizarPreguntasConResultado(this.respuestasEvaluacion)
    } else {
      this.ultimoEstadoEvaluacion = await this.consultarUltimoEstadoEvaluacion();
      await  this.obtnerUnidadMedida();
      await this.consularItems();
    }
  }



  onRespuestaChange(respuesta: any, index: number) {
    this.respuestas[index] = respuesta;

    if (!this.visualizacion){
      // Esconde las preguntas dependientes
      if (index === 4) {
        const preguntaDependiente = this.listaPreguntas[2].preguntas[1];
        preguntaDependiente.visible = respuesta.valorSeleccionado === 0;
        if (!preguntaDependiente.visible){
          preguntaDependiente.opcionSeleccionada = "NO";
          preguntaDependiente.valorSeleccionado = 0;
        }
      }

      if (index === 8) {
        const preguntaDependiente = this.listaPreguntas[3].preguntas[2];
        preguntaDependiente.visible = respuesta.valorSeleccionado === 0;
        if (!preguntaDependiente.visible){
          preguntaDependiente.opcionSeleccionada = "NO";
          preguntaDependiente.valorSeleccionado = 0;
        }
      }
    }


    // Actualiza el valor seleccionado en la pregunta correspondiente
    const pregunta = this.listaPreguntas
      .flatMap((seccion) => seccion.preguntas)
      .find((p) => p.index === index);

    if (pregunta) {
      pregunta.valorSeleccionado = respuesta.valorSeleccionado;
      pregunta.opcionSeleccionada = respuesta.opcionSeleccionada;
      this.calcularValorSeccion();
    }

    // Calcular valor total evaluacion
    this.valorTotalEvaluacion = this.calcularTotalEvaluacion();

    //Obtener la clasificación
    this.obtenerClasificacionTexto(this.valorTotalEvaluacion);
  }

  async consultarUltimoEstadoEvaluacion(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.evaluacionCumplidosCrud
        .get(
          `/cambio_estado_asignacion_evaluador/?query=AsignacionEvaluadorId.Id:${this.asignacionEvaluador.Id},Activo:true&sortby=FechaCreacion&order=desc&limit=1`
        )
        .subscribe({
          next: (res: any) => {
            let CambioEstadoAsignacionEvalacion = res.Data[0];
            resolve(CambioEstadoAsignacionEvalacion);
          },
          error: (error: any) => {
            reject(error);
          },
        });
    });
  }


  async consularItems(): Promise<Item[]> {

    return new Promise((resolve, reject) => {
      this.evaluacionCumplidosCrud
        .get(`/asignacion_evaluador_item?query=AsignacionEvaluadorId.Id:${this.asignacionEvaluador.Id}`)
        .subscribe({
          next: (asignacion: any) => {
            if(asignacion.Data && asignacion.Data[0].Id!=null){
              this.listaItems = asignacion.Data.map((itemId: any) => {
                return {
                  Id: itemId.ItemId.Id,
                  EvaluacionId:  itemId.ItemId.EvaluacionId,
                  Identificador: itemId.ItemId.Identificador,
                  Nombre: itemId.ItemId.Nombre,
                  ValorUnitario: itemId.ItemId.ValorUnitario,
                  Iva: itemId.ItemId.Iva,
                  FichaTecnica: itemId.ItemId.FichaTecnica,
                  Unidad: this.obtenerUnidadPorId(itemId.ItemId.Unidad),
                  Cantidad: itemId.ItemId.Cantidad,
                  TipoNecesidad: this.obtenerTipoNecesidad(itemId.ItemId.TipoNecesidad),
                  Activo: itemId.ItemId.Activo,
                  FechaCreacion: itemId.ItemId.FechaCreacion,
                  FechaModificacion: itemId.ItemId.FechaModificacion,
                };
              });
            }
            resolve(this.listaItems);
          },error: (error) => {
            this.popUpManager.showErrorAlert('Error al obtener los items de la evaluación');
          },
        });
    });
  }


obtnerUnidadMedida(): Promise<UnidadMedida[]> {

   return new Promise((resolve, reject) => {
    this.AdministrativaAmazonService.get(`/unidad`).subscribe({
      next: (unidadMedida: any) => {
          this.listaMedidas = unidadMedida.map((unidad: any) => {

            return {
              Id: unidad.Id,
              Unidad:  unidad.Unidad,
              Tipo:  unidad.Tipo,
              Descripcion: unidad.Descripcion,
              Estado:     unidad.Estado,
            }
          });

        resolve(this.listaMedidas);
      },error: (error) => {
        this.popUpManager.showErrorAlert('Error al obtener las unidades de medida');
      }
    })
   })


}

obtenerListaClasificaciones(){
  this.evaluacionCumplidosCrud
  .get(`/clasificacion`)
  .pipe(
    map((res: any) => res.Data as Clasificacion[])
  )
  .subscribe({
    next: async(data: Clasificacion[]) => {
      this.listaClasificaciones = data;
    }
  })
}

calcularValorSeccion() {
  this.listaPreguntas.forEach((seccion) => {
    seccion.valorSeccion = seccion.preguntas.reduce((total: number, pregunta: any) => {
      return total + (pregunta.valorSeleccionado || 0);
    }, 0);
  });
}

calcularTotalEvaluacion(): number {
  return this.listaPreguntas.reduce((total: number, seccion: any) => {
    return total + seccion.valorSeccion;
  }, 0);
}

obtenerClasificacionTexto(puntaje:number) {
  for (var i = 0; i < this.listaClasificaciones.length; i++) {
    if (puntaje >= this.listaClasificaciones[i].LimiteInferior && puntaje <= this.listaClasificaciones[i].LimiteSuperior) {
      this.calificacionTexto = this.listaClasificaciones[i].Nombre;
      console.log(this.calificacionTexto);
      this.clasificacionId = this.listaClasificaciones[i].Id;
      break
    }
  }
}

 async enviarEvaluacion() {
  let confirm = await this.popUpManager.showConfirmAlert(
    '¿Esta seguro de enviar la evaluación?'
  );
  if (confirm.isConfirmed) {
    if (!this.comprobarPreguntasRespondidas()) {
      this.popUpManager.showErrorAlert(
        'No se han contestado todas las preguntas'
      );
      return
    }
    if (
      this.ultimoEstadoEvaluacion.EstadoAsignacionEvaluadorId
        .CodigoAbreviacion === 'EAG'
    ) {

      let cambioEstado = {
        AsignacionId: {
          Id: this.asignacionEvaluador.Id,
        },
        AbreviacionEstado: 'ERE',
      };
      await this.evaluacionCumplidosMid
        .post(`/asignaciones/cambiar-estado`, cambioEstado)
        .subscribe({
          next: (res: any) => {},
          error: (error: any) => {
            this.popUpManager.showErrorAlert(
              'Error al cambiar el estado de la evaluación'
            );
          },
        });

      await this.evaluacionCumplidosMid
        .post('/resultado/resultado-evaluacion', this.crearCuerpoRespuesta())
        .subscribe({
          next: (res: any) => {},
          error: (error: any) => {
            this.popUpManager.showErrorAlert('Error al enviar la evaluación');
          },
          complete: () => {
            this.router.navigate(['/listar-contratos-evaluar'], {
              queryParams: {
                mensajeDeConfirmacion: 'Evaluación enviada correctamente',
              },
            });
          },
        });
    } else {
      this.popUpManager.showErrorAlert(
        'El estado de la asignación no permite realizar la evaluación'
      );
    }
  }

  }

crearCuerpoRespuesta(): BodyEvaluacion{
  const resultadosIndividuales = this.listaPreguntas.flatMap((seccion) =>
    seccion.preguntas.map((pregunta) => ({
      Categoria: seccion.elemento.toUpperCase(),
      Titulo: pregunta.titulo.toUpperCase(),
      Respuesta: {
        Pregunta: pregunta.pregunta,
        Cumplimiento: pregunta.opcionSeleccionada.toUpperCase(),
        ValorAsignado: pregunta.valorSeleccionado,
      },
    }))
  );
  return {
    AsignacionEvaluadorId: this.asignacionEvaluador.Id,
    ClasificacionId: this.clasificacionId,
    Observaciones: this.FormularioEvaluacion.get('observaciones')?.value,
    ResultadoEvaluacion: {
      ResultadosIndividuales: resultadosIndividuales,
    },
  };
}

comprobarPreguntasRespondidas(): boolean {
  return this.listaPreguntas.every(seccion =>
    seccion.preguntas.every(pregunta =>
      !pregunta.visible || pregunta.opcionSeleccionada !== ""
    )
  );
}

actualizarPreguntasConResultado(resultado: Resultado): Preguntas[] {
  // Recorremos cada sección de preguntas
  return this.listaPreguntas.map((seccion) => {
    // Recorremos cada pregunta dentro de la sección
    const preguntasActualizadas = seccion.preguntas.map((pregunta) => {
      // Buscamos la coincidencia en el resultado
      const resultadoCoincidente = resultado.ResultadosIndividuales.find(
        (resultadoIndividual) =>
          resultadoIndividual.Categoria.toUpperCase() === seccion.elemento.toUpperCase() &&
          resultadoIndividual.Titulo.toUpperCase() === pregunta.titulo.toUpperCase() &&
          resultadoIndividual.Respuesta.Pregunta.toUpperCase() === pregunta.pregunta.toUpperCase()
      );

      // Si encontramos una coincidencia, actualizamos los campos
      if (resultadoCoincidente) {
        return {
          ...pregunta,
          opcionSeleccionada: resultadoCoincidente.Respuesta.Cumplimiento,
          valorSeleccionado: resultadoCoincidente.Respuesta.ValorAsignado,
        };
      }

      // Si no hay coincidencia, devolvemos la pregunta sin cambios
      return pregunta;
    });

    // Devolvemos la sección con las preguntas actualizadas
    return {
      ...seccion,
      preguntas: preguntasActualizadas,
    };
  });
}

obtenerUnidadPorId(id: number): string {
  const unidadEncontrada = this.listaMedidas.find(unidad => unidad.Id === id);
  return unidadEncontrada ? unidadEncontrada.Unidad : 'Unidad no encontrada';
}

  obtenerTipoNecesidad(tipoNecesidad: number): string {

    if (tipoNecesidad === 1) {
      return 'BIEN';
    }
     if (tipoNecesidad === 2) {
      return 'SERVICIO';
    }
    if (tipoNecesidad === 3) {
      return 'BIENES Y SERVICIOS';
    }
      return 'No definido';
  }
}



