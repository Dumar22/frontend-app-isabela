import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListExitMaterialsService } from 'src/app/dashboard/services/listExitMaterials.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-list-exist',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  
<div class="container">
    
  
  <div class="bg-info.bg-gradient d-flex">
    <button type="button" class="btn btn-primary " (click)="addExitList()"  >Nueva salida</button>
  
  </div>
  <!-- <div class="bg-info.bg-gradient d-flex">
    <button type="button" class="btn btn-primary " (click)="addExitList()"  >Nueva salida x lista</button>
  
  </div> -->
   </div>
  
  <div class="row animated fadeIn fast"
       *ngIf="loading">
      <div class="col-12">
          <div class="alert text-center">
            <h4 class="alert-heading">Cargando</h4>
            <i class="fa fa-spin fa-refresh fa-2x"></i>
            <p class="mb-0">Por favor espere</p>
          </div>
  
      </div>
  </div>
  <div class="d-flex col-sm-12 col-md-12 col-lg-12 mt-5 mx-auto rounded row-cols-2 m-auto justify-content-center text-center" >
  
    <table
    class="table align-middle mb-0 bg-white"
  
    >
      <thead class="bg-light">
        <tr>
        <th>#</th>
        <th>Lista</th>        
        <th>Detalles</th>
        <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr  *ngFor="let factura of exit; let i = index">
          <td>
            <p class="fw-normal mb-1 text-primary">{{i+1}}.</p>
          </td>
          <td>
            <p class="fw-bold mb-1">{{factura.nameList }}</p>
          </td>
         
         
          <td><button type="button" class="btn btn-secondary btn-sm btn-rounded"
            (click)="detailList(factura)">
            Detalles
          </button></td>
         
          <!-- <td>
            <button type="button" class="btn btn-secondary btn-sm btn-rounded" (click)="exitForList(factura)">
              Salida x lista
            </button>
          </td> -->
          <td>
            <button type="button" (click)="deleteList(factura)" class="btn btn-secondary btn-sm btn-rounded text-danger">
              Eliminar
            </button>
          </td>
        </tr>
  
      </tbody>
    </table>
  
  
  </div>
  <div>
  
  </div>
  
  

  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class TableListExistComponent {


  route: [] = [];

  public exit: any[] = [];
  public factura : any;
  public exitTemp: any[] = [];
  public loading: boolean = true;

  constructor(private exitService: ListExitMaterialsService,
    
    private router: Router) { }

    ngOnInit(): void{

      this.getListExits();
  
     };
  
  
     getListExits(){
  
      this.loading = true;
      this.exitService.getMaterials()
      .subscribe((data:any[]) =>{     
        this.exit = data;              
        this.exitTemp = data;
        this.loading = false;
      } );
     }


    // Buscar
 
  
  
  detailList(entry: any){          
    this.router.navigate(['dashboard/details-list-table-exit', entry.id]);
    }

  deleteList(exit: any) {
    Swal.fire({
      title: '¿Borrar Lista?',
      text: `Esta a punto de borrar a ${ exit.nameList }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {

        this.exitService.deleteMaterial( exit )
          .subscribe( resp => {

            this.getListExits();
            Swal.fire(
              'Lista Eliminada',
              `Lista ${ exit.nameList } fue eliminada correctamente`,
              'success'
            );

          });

      }
    })


  }

addExit(){
    this.router.navigate(['dashboard/add-list']);
  }
addExitList(){
    this.router.navigate(['dashboard/add-list']);
  }
  
// exitForList(list: any) {
//   this.router.navigate(['dashboard/add-exit-material-list', list.id]);
// }
 }
