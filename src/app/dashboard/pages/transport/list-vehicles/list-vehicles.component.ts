import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';
import { Vehicle } from 'src/app/dashboard/interfaces/vehiclesInterface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { VehicleService } from 'src/app/dashboard/services/vehicle.service';

@Component({
  standalone: true,
  imports: [CommonModule, UiModulesModule],
  templateUrl: './list-vehicles.component.html',
  styleUrls: ['./list-vehicles.component.css']
})
export class ListVehiclesComponent {

  public vehicles: any[] = [];  
  public vehicleTemp: Vehicle[] = [];
  public loading: boolean = true;  
  public providersCount: number = 0;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
 

  constructor(private vehicleService: VehicleService,    
    
    private router: Router) { }

  ngOnInit(): void{
    this.getListVehicles();
    };
 
   getListVehicles(){
    this.loading = true;
     this.vehicleService.getVehicles()
  .subscribe((data: any) => {  
    
    this.vehicles = data;
    this.vehicles.sort((a, b) => a.make.localeCompare(b.make));
    this.vehicleTemp = data;  
    this.loading = false;
    } );
   }

   onTableDataChange(event: any) {
    this.page = event;
    this.getListVehicles();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListVehicles();
  }

   deleteVehicle(vehicle:Vehicle) {

    Swal.fire({
      title: '¿Borrar proveedor?',
      text: `Esta a punto de borrar a ${ vehicle.plate }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {

        this.vehicleService.deleteVehicle( vehicle )
          .subscribe( resp => {

            this.getListVehicles();
            Swal.fire(
              'Vehículo borrado',
              `${ vehicle.make } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })
  }

  updateVehicle(vehicle: Vehicle){ 
    this.router.navigate(['dashboard/add-edit-vehicle/',vehicle.id]);
  }

  addVehicle():void{
    this.router.navigate(['dashboard/add-edit-vehicle']);
  }

}
