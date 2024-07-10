import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Warehouse } from 'src/app/dashboard/interfaces/warehouseInterface';
import { WarehousesService } from '../../../services/warehouses.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'list-warehouses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-warehouses.component.html',
  styleUrls: ['./list-warehouses.component.css']
})
export class ListWarehousesComponent implements OnInit {


  public warehouses: any[] = [];
  public warehouse: Warehouse;
  public warehouseTemp: Warehouse[] = [];
  public loading: boolean = true;

  constructor(private warehouseService: WarehousesService,
   
    private router: Router) { }

  ngOnInit(): void{

    this.getListWarehouses();
   };


  async getListWarehouses(){
    this.loading = true;
   await this.warehouseService.getWarehouses()
    .subscribe((data:any) =>{
      this.warehouses = data;           
      this.warehouseTemp = data
      this.loading = false;
    } );
   }

    
 


   deleteWarehouse(warehouse:Warehouse) {
    Swal.fire({
      title: '¿Borrar Bodega?',
      text: `Esta a punto de borrar a ${ warehouse.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarla'
    }).then((result) => {
      if (result.value) {

        this.warehouseService.deleteWarehouse( warehouse )
          .subscribe( resp => {

            this.getListWarehouses();
            Swal.fire(
              'Bodega borrada',
              `${ warehouse.name } fue eliminada correctamente`,
              'success'
            );

          });

      }
    })


  }

  updateWarehouse(warehouse: Warehouse){
    this.router.navigate(['dashboard/editwarehuse/',warehouse.id]);
  }

  addWarehouse():void{
    this.router.navigate(['dashboard/addwarehuse']);
  }
}
