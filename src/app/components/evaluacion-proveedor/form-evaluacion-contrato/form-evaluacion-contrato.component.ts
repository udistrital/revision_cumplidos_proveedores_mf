import { Component, OnInit } from '@angular/core';
import { AsignacionEvaluador } from 'src/app/models/evaluacion_cumplido_prov_crud/asignacion_evaluador.model';
import { Evaluacion } from 'src/app/models/evaluacion_cumplido_prov_crud/evaluacion.model';
import { Item } from 'src/app/models/evaluacion_cumplido_prov_crud/item.model';
import { EvaluacionCumplidoProvCrudService } from 'src/app/services/evaluacion_cumplido_prov_crud';
import { map } from 'rxjs';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { UnidadMedida } from 'src/app/models/unidad-medida';
import { AdministrativaAmazonService } from 'src/app/services/administrativa_amazon.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

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
  calificacionTexto: string = "Malo";
  valorTotalEvaluacion: number = 0;

  FormularioEvaluacion: FormGroup;
  listaPreguntas = [
    {
      elemento: 'Cumplimiento',
      valorSeccion: 0,
      preguntas: [
        {
          titulo: 'Tiempos de entrega',
          pregunta: '¿Se cumplieron los tiempos de entrega de bienes o la prestación del servicios ofertados por el proveedor?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 12 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 0,
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Cantidades',
          pregunta: '¿Se entregan las cantidades solicitadas?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 12 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 1,
          valorSeleccionado: 0,
          visible: true, 
        },
      ],
    },
    {
      elemento: 'Calidad',
      preguntas: [
        {
          titulo: 'Conformidad',
          pregunta: '¿El bien o servicio cumplió con las especificaciones y requisitos pactados en el momento de entrega?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 20 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 2,
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Funcionalidad adicional',
          pregunta: '¿El producto comprado o el servicio prestado proporcionó más herramientas o funciones de las solicitadas originalmente?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 10 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 3,
          valorSeleccionado: 0,
          visible: true, 
        },
      ],
    },
    {
      elemento: 'Pos contractual',
      preguntas: [
        {
          titulo: 'Reclamaciones',
          pregunta: '¿Se han presentado reclamaciones al proveedor en calidad o gestión?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 0 },
            { cumplimiento: 'NO', valor: 12 }
          ],
          index: 4,
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Reclamaciones',
          pregunta: '¿El proveedor soluciona oportunamente las no conformidades de calidad y gestión de los bienes o servicios recibidos?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 12 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 5,
          valorSeleccionado: 0,
          visible: false, 
        },
        {
          titulo: 'Servicio pos venta',
          pregunta: '¿El proveedor cumple con los compromisos pactados dentro del contrato u orden de servicio o compra? (aplicación de garantías, mantenimiento, cambios, reparaciones, capacitaciones, entre otras)',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 10 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 6,
          valorSeleccionado: 0,
          visible: true, 
        },
      ],
    },
    {
      elemento: 'Gestión',
      preguntas: [
        {
          titulo: 'Procedimientos',
          pregunta: '¿El contrato es suscrito en el tiempo pactado, entrega las pólizas a tiempo y las facturas son radicadas en el tiempo indicado con las condiciones y soportes requeridos para su trámite contractual?',
          valorAsignado: [
            { cumplimiento: 'EXCELENTE', valor: 9 },
            { cumplimiento: 'BUENO', valor: 6 },
            { cumplimiento: 'REGULAR', valor: 3 },
            { cumplimiento: 'MALO', valor: 0 }
          ],
          index: 7,
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Garantía',
          pregunta: '¿Se requirió hacer uso de la garantía del producto o servicio?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 0 },
            { cumplimiento: 'NO', valor: 15 }
          ],
          index: 8,
          valorSeleccionado: 0,
          visible: true, 
        },
        {
          titulo: 'Garantía',
          pregunta: '¿El proveedor cumplió a satisfacción con la garantía pactada?',
          valorAsignado: [
            { cumplimiento: 'SI', valor: 15 },
            { cumplimiento: 'NO', valor: 0 }
          ],
          index: 9,
          valorSeleccionado: 0,
          visible: false, 
        },
      ],
    },
  ];

  constructor(
    private evaluacionCumplidosCrud: EvaluacionCumplidoProvCrudService,
    private evaluacionCumplidoProvCrudService: EvaluacionCumplidoProvCrudService,
    private AdministrativaAmazonService: AdministrativaAmazonService,
    private popUpManager: PopUpManager,
    private fb: FormBuilder
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
   await  this.obtnerUnidadMedida()
    await this.consularItems();
  }

  onRespuestaChange(respuesta: any, index: number) {
    console.log("Respuesta:", respuesta)
    this.respuestas[index] = respuesta;
  
    // Esconde las preguntas dependientes
    if (index === 4) { 
      const preguntaDependiente = this.listaPreguntas[2].preguntas[1]; 
      preguntaDependiente.visible = respuesta.valorSeleccionado === "0"; 
    }
  
    if (index === 8) { 
      const preguntaDependiente = this.listaPreguntas[3].preguntas[2]; 
      preguntaDependiente.visible = respuesta.valorSeleccionado === "0"; 
    }

    // Actualiza el valor seleccionado en la pregunta correspondiente
    const pregunta = this.listaPreguntas
      .flatMap((seccion) => seccion.preguntas)
      .find((p) => p.index === index);

    if (pregunta) {
      pregunta.valorSeleccionado = Number(respuesta.valorSeleccionado);
      this.calcularValorSeccion();
    }

    // Calcular valor total evaluacion
    this.valorTotalEvaluacion = this.calcularTotalEvaluacion();

    //Obtener la clasificación
    this.obtenerCalificacionTexto( this.valorTotalEvaluacion);
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

calcularValorSeccion() {
  this.listaPreguntas.forEach((seccion) => {
    seccion.valorSeccion = seccion.preguntas.reduce((total: number, pregunta: any) => {
      return total + (pregunta.valorSeleccionado || 0);
    }, 0);
  });
  console.log(this.listaPreguntas)
}

calcularTotalEvaluacion(): number {
  return this.listaPreguntas.reduce((total: number, seccion: any) => {
    return total + seccion.valorSeccion;
  }, 0);
}

obtenerCalificacionTexto(puntaje:number) {

  if(puntaje>=80 && puntaje<=100){
    this.calificacionTexto = "Excelente"
    
  }

  if(puntaje>=46 && puntaje<=79){
     this.calificacionTexto = "Bueno"

  }

  if(puntaje>=0 && puntaje<=45){
     this.calificacionTexto = "Malo"
  }
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

