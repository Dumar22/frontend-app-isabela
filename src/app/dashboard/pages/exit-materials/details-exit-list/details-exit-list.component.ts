import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import { MaterialsService } from 'src/app/dashboard/services/materials.service';

@Component({
  selector: 'details-exit-list',
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule
  ],
  templateUrl: 'details-exit-list.component.html',
  styleUrls: ['./details-exit-list.component.css'],
})
export class DetailsExitListComponent { 

  @Input() materials: any[] = [];
  @Output() materialsChange = new EventEmitter<any[]>();

  formMaterial: FormGroup;
  material: Material[] = [];
 

  constructor(
    private formBuilder: FormBuilder,
    private materialService: MaterialsService,
    
  ) {
    this.formMaterial = this.formBuilder.group({
      materialId: ['', Validators.required],
      materialName: [''],
      assignedQuantity: ['', [Validators.required, Validators.min(1)]],
      restore: [0],
      assignedAt: [new Date().toISOString()],
      meterId: ['', Validators.required],
      meterName: ['', Validators.required],
      meterCode: ['', Validators.required],
      assignedQuantityMeter: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getListMaterials();
   
  }

  getListMaterials() {
    this.materialService.getMaterials().subscribe((data: Material[]) => {
      this.material = data;
    });
  }
  

 

  // Función para buscar el nombre del material en función del código seleccionado
  updateMaterialName() {
    const selectedMaterialId = this.formMaterial.get('materialId').value;
    const selectedMaterial = this.material.find(
      (m) => m.id === selectedMaterialId
    );
    if (selectedMaterial) {
      this.formMaterial.patchValue({ materialName: selectedMaterial.name });
    }
  }

  getMaterialProperty(materialId: string, propertyName: string): any {
    const selectedTool = this.material.find(
      (material) => material.id === materialId
    );
    return selectedTool ? selectedTool[propertyName] : null;
  }

 

  addTool() {
    
    const newTool = {
      materialId: this.formMaterial.value.meterId || this.formMaterial.value.materialId,
      assignedQuantity: this.formMaterial.value.assignedQuantity || this.formMaterial.value.assignedQuantityMeter,
      restore: 0,
      assignedAt: this.formMaterial.value.assignedAt,
    };

    this.materials.push(newTool);

    this.materialsChange.emit(this.materials);
    
    this.formMaterial.reset();
  }

  removeMaterial(material: any) {
    const index = this.materials.indexOf(material);
    if (index !== -1) {
      this.materials.splice(index, 1);
      this.materialsChange.emit(this.materials);
    }
  }

}
