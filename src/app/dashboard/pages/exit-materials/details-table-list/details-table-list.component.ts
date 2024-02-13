import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListExitMaterialsService } from 'src/app/dashboard/services/listExitMaterials.service';

@Component({
  selector: 'app-details-table-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  <div class="container my-4" *ngIf="exit">
    <div class="card shadow-sm">
      <div class="card-body" >
        <h2 class="card-title mb-4">Detalles de la salida {{ exit.nameList }}</h2>
        <div class="space">
          <div >
            <p><strong>Fecha:</strong> {{ exit.nameList }}</p>
           
          </div>
         
        </div>
                
        <table class="table table-bordered table-striped mt-4">
          <thead class="bg-light">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Código</th>
              <th scope="col">Unidad</th>
              <th scope="col">Serial</th>
              <th scope="col">Devolución</th>
              <th scope="col">Utilizado</th>
              <th scope="col">Valor unitario</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let detail of exit.details">
              <td>{{ detail.material.name }}</td>
              <td>{{ detail.material.code }}</td>
              <td>{{ detail.material.unity }}</td>
              <td>{{ detail.material.serial }}</td>
              <!-- <td>{{ detail.meter ? 'Medidor' : 'Material' }}</td> -->
              <td>{{ detail.assignedQuantity }}</td>
              <td>{{ detail.restore }}</td>
              <td>{{ detail.used }}</td>
              <!-- <td>{{ detail.value }}</td> -->
              <td>{{ detail.material.price }}</td>
              <td>{{ detail.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <!-- <button type="button" class="btn btn-primary mr-2" (click)="editExit(exit)">Editar</button> -->
        <button type="button" class="btn btn-secondary" (click)="prev()">Volver</button>
      </div>
    </div>
  </div>

  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class DetailsTableListComponent {

  exit: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exitService: ListExitMaterialsService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.exitService.getMaterialById(id).subscribe((data: any) => {
      this.exit = data;
             
         
    });
  }

  // editExit(exit: any) {
  //   this.router.navigate(['dashboard/add-list', exit.id]);
  // }
  prev() {
    this.router.navigate(['dashboard/list-table-exit']);
  }

 }
