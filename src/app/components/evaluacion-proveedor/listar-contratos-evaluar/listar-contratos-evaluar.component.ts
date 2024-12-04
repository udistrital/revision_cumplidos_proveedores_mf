import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CumplidosProveedoresMidService } from './../../../services/cumplidos_proveedores_mid.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UserService } from 'src/app/services/user.services';
import { PopUpManager } from 'src/app/managers/popUpManager';


@Component({
  selector: 'app-listar-contratos-evaluar',
  templateUrl: './listar-contratos-evaluar.component.html',
  styleUrls: ['./listar-contratos-evaluar.component.scss']
})
export class ListarContratosEvaluarComponent {

  tittle!: string;
  filtrosForm!: FormGroup;
  vigencias!: number[];
  dataSource: any[] = [];
  documentoSupervisor!: string;

  displayedColumns: any[] = [
    {def: 'nombreProveedor', header: 'NOMBRE' },
    {def: 'dependencia', header: 'DEPENDENCIA' },
    {def: 'tipoContrato', header: 'TIPO DE CONTRATO' },
    {def: 'contrato', header: 'CONTRATO' },
    {def: 'vigencia', header: 'VIGENCIA' },
    {
      def: 'acciones',
      header: 'ACCIONES',
      isAction: true,
    }
  ];


  constructor(
    private fb: FormBuilder,private cumplidosProveedoresMidService: CumplidosProveedoresMidService,private userService: UserService, private popUpManager:PopUpManager
  ){
    this.filtrosForm = this.fb.group({
      nombreProveedor: ['', [Validators.minLength(5)]],
      numeroContrato: ['', [Validators.pattern(/^[0-9]+$/)]],
      vigencia: ['', [Validators.pattern(/^[0-9]+$/)]],
    });

    this.documentoSupervisor=this.userService.getPayload().documento;
   
  }


 async ngOnInit(){
    await this.consultarContratos();
    this.tittle = "Lista Proveedores";
    this.vigencias = this.obtenerListaVigencias();

  }

  obtenerListaVigencias() {
    const anioActual = new Date().getFullYear();  // Obtiene el año actual
    const anios = [];

    for (let i = 2017; i <= anioActual; i++) {
        anios.push(i);
    }
    return anios;
  }





  consultarContratos():Promise<void> {
    return new Promise((resolve, reject) => {
      
      this.cumplidosProveedoresMidService.get('/supervisor/contratos-supervisor/'+this.documentoSupervisor).subscribe({
        next: (res: any) => {
          if(res.Data && res.Data.contratos.length > 0){
            this.dataSource = res.Data.contratos.map((item: any) => {
              return {
                nombreProveedor: item.NombreProveedor,
                dependencia: item.NombreDependencia,
                tipoContrato: item.TipoContrato,
                contrato: item.NumeroContratoSuscrito,
                vigencia: item.Vigencia,
                acciones: [
                  {
                    icon: 'edit',
                    actionName: 'edit',
                    isActive: true,
                  },
                  {
                    icon: 'visibility',
                    actionName: 'visibility',
                    isActive: true,
                  },
                  {
                    icon: 'accessibility',
                    actionName: 'accessibility',
                    isActive: true,
                  },
                ],
              }
              
            },)
            
            
          }
          resolve()
        },error: (err: any) => {
          this.popUpManager.showErrorAlert("Error al consultar los contratos")
        }
        
      })
    });


  }

}
