import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MaterialsService } from '../../services/materials.service';
import { Material } from '../../interfaces/materialsInterface';


@Component({
  selector: 'material-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './material-details.component.html',
  styleUrls: ['./material-details.component.css']
})
export class MaterialDetailsComponent {


  @Input() materials: any[] = [];
  @Output() materialsChange = new EventEmitter<any[]>();

  materialForm: FormGroup;
  material:Material[] = [];
  constructor(private formBuilder: FormBuilder, 
          private materialService: MaterialsService) {

           this.materialForm = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            quantity: [0, [Validators.required, Validators.min(1)]],
            price: ['',],            
            serial: [''],
           observations: ['']
         });
     }

  ngOnInit(): void {
 
    this.getListMaterials();
   
  }

 
  getListMaterials(){
    this.materialService.getMaterials()
    .subscribe((data:Material[]) =>{                
      this.material = data;
      this.material.sort((a, b) => a.name.localeCompare(b.name));
      
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
}

  priceMaterialSelect() {
    const selectedMaterial = this.material.find(material => material.code === this.materialForm.value.code);
    
    if (selectedMaterial) {
        this.materialForm.patchValue({
            price: selectedMaterial.price
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
}

  addMaterial() {
    const selectedMaterial = this.material.find(material => material.name === this.materialForm.value.name);
   
    if (selectedMaterial) {
        const newMaterial = {
            id: selectedMaterial.id,
            code: selectedMaterial.code,
            name: this.materialForm.value.name,
            quantity: this.materialForm.value.quantity,
            price: this.materialForm.value.price,
            serial: this.materialForm.value.serial,
            observations: this.materialForm.value.observations,
            unity: selectedMaterial.unity, // Ajusta esta línea según la propiedad correspondiente en tu objeto de material
            
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
