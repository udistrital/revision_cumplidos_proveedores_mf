import { Component, Inject, Input } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, map, Observable, of } from 'rxjs';
import { ModalVerSoporteComponent } from 'src/app/components/modal-ver-soporte/modal-ver-soporte.component';
import { AletManagerService } from 'src/app/managers/alert-manager.service';
import { CambioEstadoCumplido, CumplidoProveedor, EstadoCumplido } from 'src/app/models/cambio-estado-cumplido.model';
import { CumplidosProveedoresCrudService } from 'src/app/services/cumplidos_proveedores_crud.service';
import { CumplidosProveedoresMidService } from 'src/app/services/cumplidos_proveedores_mid.service';
import { SoporteCumplido } from 'src/app/models/soporte_cumplido.model';
import { Observacion } from 'src/app/models/observacion.model';
@Component({
  selector: 'app-modal-listar-soportes-contratacion',
  templateUrl: './modal-listar-soportes.component.html',
  styleUrls: ['./modal-listar-soportes.component.css']
})



export class ModalListarSoportes {
  soportesCumplido:SoporteCumplido[] = []
  observaciones: { [key: number]: string } = {};
  idCumplido:number=0;

  constructor(private alerts:AletManagerService,
    public dialog:MatDialog,
    public dialogRef: MatDialogRef<ModalListarSoportes>,
    private cumplidos_provedore_crud_service:CumplidosProveedoresCrudService,
    private cumplidos_provedore_mid_service:CumplidosProveedoresMidService,
    @Inject (MAT_DIALOG_DATA) public data:{soporteCumplido:SoporteCumplido[], idCumplido: number}
  ){
    this.soportesCumplido = data.soporteCumplido;
    console.log(this.soportesCumplido)

    this.idCumplido=data.idCumplido;
     console.log(this.soportesCumplido[0].Documento.Id)


  }

 
  

  async enviarComentario(soporteId:number){
    let enviarComnetario = await this.alerts.alertConfirm("¿Estas seguro de enviar las observaciones?");

    const cambioEstado = await this.ObtenerCambioEstado(this.idCumplido).toPromise();

    if(enviarComnetario.isConfirmed && cambioEstado!=null){

      try{
        const  observacionData= new Observacion(cambioEstado.CumplidoProveedorId.Id.toString(),cambioEstado.EstadoCumplidoId.Id.toString(),this.observaciones[soporteId]);
        this.observaciones[soporteId]="";

        this.cumplidos_provedore_mid_service.post("/solicitud-pago/comentario-soporte",observacionData).subscribe((response)=>{
          this.alerts.showSuccessAlert("Comentario Guardado", "Se ha guardado el comentario en el documento")
        });
      }catch(error){
        this.alerts.showCancelAlert("Cancelado", "No se ha guardo ningun comentario"+error);
      }
    }else{
      this.alerts.showCancelAlert("Cancelado", "No se ha guardo ningun comentario");
    }
   }

   ObtenerCambioEstado(idCumplido: number): Observable<CambioEstadoCumplido | null> {
    return this.cumplidos_provedore_crud_service
      .get(
        `/cambio_estado_cumplido/?query=CumplidoProveedorId.id:${idCumplido},Activo:true`
      )
      .pipe(
        map((response: any) => {
          if (response.Data && response.Data.length > 0) {
            const data = response.Data[0];

            return new CambioEstadoCumplido(
              data.Id,
              new EstadoCumplido(
                data.EstadoCumplidoId.Id,
                data.EstadoCumplidoId.Nombre,
                data.EstadoCumplidoId.CodigoAbreviacion,
                data.EstadoCumplidoId.Descripcion,
                data.EstadoCumplidoId.Activo
              ),
              new CumplidoProveedor(
                data.CumplidoProveedorId.Id,
                data.CumplidoProveedorId.NumeroContrato,
                data.CumplidoProveedorId.VigenciaContrato,
                data.CumplidoProveedorId.Activo,
                data.CumplidoProveedorId.FechaCreacion,
                data.CumplidoProveedorId.FechaModificacion
              ),
              data.DocumentoResponsable,
              data.CargoReponsable,
              data.Activo,
              data.FechaCreacion,
              data.FechaModificacion
            );
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error en la obtención de CambioEstadoCumplido', error);
          return of(null); // Retorna null en caso de error
        })
      );
  }
   openVerSoporte(pdfBase64: string) {
    this.dialog.open(ModalVerSoporteComponent, {
      disableClose: true,
      height: '70vh',
      width: '50vw',
      maxWidth: '60vw',
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container',
      data: { base64: pdfBase64 }
    });
  }


 

}
//cambio_estado_cumplido/?query=CumplidoProveedorId.id:2,Activo:true
/*
{
  "soporte_id": "13",
  "cambio_estado_id": "7",
  "comentario": "No es posible abrir el archivo, por eso se rechaza el cumplido xd :((, para la proxima rey."
}


*/



