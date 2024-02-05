import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ToolsService } from '../../services/tools.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Material } from '../../interfaces/materialsInterface';

@Component({
  selector: 'tools-details-entries',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
  ],
  template: `
  <!-- Formulario para agregar detalles de materiales -->
  <div class="container">
    <h4 class="text-center">Agregar herramientas a la factura</h4>
  <form class="row" [formGroup]="materialForm" (ngSubmit)="addMaterial()">
    <div class="col-md-3">
      <label for="code" class="form-label">Código:</label>
  <select id="code" class="form-select" aria-label="Default select example" formControlName="code" (change)="onMaterialSelect()">
          <option value="" selected >--Seleccione un código--</option>
          <option *ngFor="let materialItem of material" [ngValue]="materialItem.code">{{ materialItem.code }}</option>        
      </select>
  </div>
  <div class="col-md-4">
      <label class="form-label">Material:</label>
      <select class="form-select" aria-label="Default select example" formControlName="name" (change)="onMaterialSelectCode()">
        <option value="" selected>--Seleccione un material--</option>
        <option *ngFor="let materialItem of material" [value]="materialItem.name">{{ materialItem.name }}</option>
    </select>      
  </div>
      <div class="col-md-2">
        <label class="form-label">Cantidad:</label>
        <input type="number" id="quantity" formControlName="quantity" class="form-control" required>
      </div>
      <div class="col-md-3 mb-1">
        <label class="form-label">Serie:</label>
        <input type="text" id="serial" formControlName="serial" class="form-control">
      </div>
      <div class="col-md-12 mb-4">
        <label class="form-label">Observaciones:</label>
        <textarea id="observations" formControlName="observations" class="form-control"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Agregar Herramienta</button>
    </form>
  </div>
  
  
    
    <!-- Tabla para mostrar los materiales agregados -->
    <table class="table mt-5 table-striped">
      <thead class="table-primary">
        <tr>
          <th scope="col" >Código</th>
          <th scope="col" >Nombre</th>
          <th scope="col" >Unidad</th>
          <th scope="col" >Cantidad</th>
          <th scope="col" >Serie</th>
          <th scope="col" >valor</th>
          <th scope="col" >Observaciones</th>
          <th scope="col" >Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let material of materials">
          <td>{{ material.code }}</td>
          <td>{{ material.name }}</td>
          <td>{{ material.unity }}</td>
          <td>{{ material.quantity }}</td>
          <td>{{ material.serial }}</td>
          <td>{{ material.price }}</td>
          <td>{{ material.obs }}</td>
          <td><button (click)="removeMaterial(material)" class="btn btn-danger">Eliminar</button></td>
        </tr>
      </tbody>
    </table>
    
  
  
  `,
  styleUrls: ['./toolsDetailsEntries.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsDetailsEntriesComponent { 

  @Input() materials: any[] = [];
  @Output() materialsChange = new EventEmitter<any[]>();

  materialForm: FormGroup;
  material:Material[] = [];
  constructor(private formBuilder: FormBuilder, 
          private materialService: ToolsService) {

           this.materialForm = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            quantity: [0, [Validators.required, Validators.min(1)]],
            serial: [''],
           observations: ['']
         });
     }

  ngOnInit(): void {
 
    this.getListMaterials();
   
  }

 
  getListMaterials(){
    this.materialService.getTools()
    .subscribe((data:Material[]) =>{                
      this.material = data;
      
  });
  }

  onMaterialSelect() {
    const selectedMaterial = this.material.find(material => material.code === this.materialForm.value.code);
    
    if (selectedMaterial) {
        this.materialForm.patchValue({
            name: selectedMaterial.name
        });
    }
}

onMaterialSelectCode() {
  const selectedMaterial = this.material.find(material => material.name === this.materialForm.value.name);
  if (selectedMaterial) {
      this.materialForm.patchValue({
          code: selectedMaterial.code
      });
  }
}

  addMaterial() {
    const selectedMaterial = this.material.find(material => material.name === this.materialForm.value.name);
   
    if (selectedMaterial) {
        const newMaterial = {
            id: selectedMaterial.id,
            code: selectedMaterial.code,
            name: this.materialForm.value.name,
            quantity: this.materialForm.value.quantity,
            serial: this.materialForm.value.serial,
            observations: this.materialForm.value.observations,
            unity: selectedMaterial.unity, // Ajusta esta línea según la propiedad correspondiente en tu objeto de material
            price: selectedMaterial.price, // Ajusta esta línea según la propiedad correspondiente en tu objeto de material
        };

        this.materials.push(newMaterial);
        
        
        this.materialsChange.emit(this.materials);
        this.materialForm.reset();
    }
  }

  removeMaterial(material: any) {
    const index = this.materials.indexOf(material);
    if (index !== -1) {
      this.materials.splice(index, 1);
      this.materialsChange.emit(this.materials);
    }
  }
}
