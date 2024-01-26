import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MetersService } from 'src/app/dashboard/services/meters.service';
import { Router } from '@angular/router';
import { Meter } from 'src/app/dashboard/interfaces/metersInterface';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';

@Component({
  standalone: true,
  imports: [CommonModule, UiModulesModule],
  templateUrl: './meter-list.component.html',
  styleUrls: ['./meter-list.component.css']
})
export class MeterListComponent {


  public meters: any[] = [];
  public metersTemp: Meter[] = [];
  public total: number; 
  public loading: boolean = true;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  
  constructor(private metersService: MetersService,
    private router: Router) { }

  ngOnInit(): void{

    this.getListMeters();

   };

   getListMeters(){

    this.loading = true;
    this.metersService.getMeters()
    .subscribe((data: any) =>{
      this.total = data.total;
      this.meters = data;
      this.metersTemp = data;
      this.loading = false;
    } );
   }

   onTableDataChange(event: any) {
    this.page = event;
    this.getListMeters();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListMeters();
  }

   //Buscar
 search (term: string ):void {

  if ( term.length === 0 ) {
    this.meters = this.metersTemp;
    return ;
  }
   this.metersService.searchMeter( term )
        .subscribe( resp => {
          this.meters = resp ;
        });
  }

   deleteMeter(meters:Meter) {


    Swal.fire({
      title: '¿Borrar Medidor?',
      text: `Esta a punto de borrar a ${ meters.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {

        this.metersService.deleteMeter( meters )
          .subscribe( resp => {

            this.getListMeters();
            Swal.fire(
              'Medidor borrado',
              `${ meters.name } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })


  }   

  updateMeter(meter: Meter){
    this.router.navigate(['dashboard/edit-meter/',meter.id]);
  }

  addMeter():void{
    this.router.navigate(['dashboard/add-meter']);
  }


}
