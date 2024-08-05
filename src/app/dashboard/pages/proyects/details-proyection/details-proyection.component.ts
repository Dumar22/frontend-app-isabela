import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Material } from '../../../interfaces/materialsInterface';
import { Tool } from 'src/app/dashboard/interfaces/tool-assignmentInterface';
import { MaterialsService } from 'src/app/dashboard/services/materials.service';
import { ToolsService } from 'src/app/dashboard/services/tools.service';
import { ProyectionsComponent } from '../proyections/proyections.component';

@Component({
  selector: 'details-proyection',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,],
  templateUrl: './details-proyection.component.html',
  styleUrls: ['./details-proyection.component.css']
})
export class DetailsProyectionComponent {

  @Input() materials: any[] = [];
  @Input() houses: number = 0;
  @Input() apartments: number = 0;
  @Output() materialsChange = new EventEmitter<any[]>();

  
  materialForm: FormGroup;
  material:Material[] = [];
  tool:Tool[] = [];
  totalB:number = 0; 
  totalI:number = 0; 
 
 

  constructor(private formBuilder: FormBuilder, 
          private materialService: MaterialsService,
          private toolService: ToolsService
          ) {

           this.materialForm = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            quantity: ['', [Validators.required, Validators.min(1)]],
            price: ['',], 
            iva:['',],         
            serial: [''],
           observation: ['']
         });
     }

  ngOnInit(): void {
 
    this.getListMaterials();
       
  }
  
  ngOnChanges(): void {
    this.logHouseAndApartmentCount();
  }
  
  logHouseAndApartmentCount() {

    console.log(this.apartments);
     
  }
 
  getListMaterials(){
    this.materialService.getMaterials()
    .subscribe((data:Material[]) =>{        
      this.material = data;
      this.material.sort((a, b) => a.name.localeCompare(b.name));
      
      this.toolService.getTools()
      .subscribe((data:Tool[]) =>{          
        this.tool = data;
        this.tool.sort((a, b) => a.name.localeCompare(b.name));

          // Agregar las herramientas al arreglo de materiales
     this.material.push(...this.tool);

     // Opcional: Ordenar el arreglo combinado por nombre
     this.material.sort((a, b) => a.name.localeCompare(b.name));
        
    });

   
  });
  }
 
  onMaterialSelect() {
    const selectedMaterial = this.material.find(material => material.code === this.materialForm.value.code);
    
    if (selectedMaterial) {
        this.materialForm.patchValue({
            name: selectedMaterial.name
        });
    }
    this.priceMaterialSelect()
    this.ivaMaterialSelect()
    this.observationMaterialSelect()
}

  priceMaterialSelect() {
    const selectedMaterial = this.material.find(material => material.code === this.materialForm.value.code);
    
    if (selectedMaterial) {
        this.materialForm.patchValue({
            price: selectedMaterial.price
        });
    }
}

ivaMaterialSelect() {
  const selectedMaterial = this.material.find(material => material.code === this.materialForm.value.code);
  
  if (selectedMaterial) {
      this.materialForm.patchValue({
          iva:  1.19
      });
  }
}

observationMaterialSelect() {
  const selectedMaterial = this.material.find(material => material.code === this.materialForm.value.code);
  
  if (selectedMaterial) {
      this.materialForm.patchValue({
        observation: selectedMaterial.observation
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
  this.priceMaterialSelect()
  this.ivaMaterialSelect()
  this.observationMaterialSelect()
}


  addMaterial() {
    const selectedMaterial = this.material.find(material => material.name === this.materialForm.value.name);

    const total = this.materialForm.value.quantity * this.materialForm.value.price;
    const total_iva = total * this.materialForm.value.iva;
    if (total_iva<=0) {
      total_iva===total
    }
    let assignedQuantity = this.materialForm.value.quantity * this.houses;
    if (assignedQuantity <= 0) {
      assignedQuantity = this.materialForm.value.quantity * this.apartments;
    }
    
    if (selectedMaterial) {
        const newMaterial = {
            id: selectedMaterial.id,
            code: selectedMaterial.code,
            name: this.materialForm.value.name,
            quantity: this.materialForm.value.quantity,
            quantityTotal: assignedQuantity,
            price: this.materialForm.value.price,
            iva: this.materialForm.value.iva,
            serial: this.materialForm.value.serial,
            observation: this.materialForm.value.observation,
            unity: selectedMaterial.unity, // Ajusta esta línea según la propiedad correspondiente en tu objeto de material
            total: Math.round(total),
            total_iva: Math.round(total * this.materialForm.value.iva),

        };
        
        this.materials.push(newMaterial);
        
        
        this.materialsChange.emit(this.materials);
        this.materialForm.reset();
        this.operations();
        
    }
  }

  operations(){
    
    
    this.totalB = this.materials.reduce((acc, detail) => acc + (detail.total), 0);
    this.totalI = this.materials.reduce((acc, detail) => acc + (detail.total_iva), 0);
    
  }

  removeMaterial(material: any) {
    const index = this.materials.indexOf(material);
    if (index !== -1) {
      this.materials.splice(index, 1);
      this.materialsChange.emit(this.materials);
    }
    this.operations();
  }

 


}