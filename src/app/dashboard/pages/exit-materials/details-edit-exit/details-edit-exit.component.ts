import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';
import { Meter } from 'src/app/dashboard/interfaces/metersInterface';
import { MaterialsService } from 'src/app/dashboard/services/materials.service';
import { MetersService } from 'src/app/dashboard/services/meters.service';

@Component({
  selector: 'details-edit-exit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  templateUrl: './details-edit-exit.component.html',
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class DetailsEditExitComponent { 

  @Input() newMaterials: any[] = [];
  @Output() newMaterialsChange = new EventEmitter<any[]>();

  formMaterial: FormGroup;
  material: Material[] = [];
  meter: Meter[] = [];
  meterSerials: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private materialService: MaterialsService,
    private meterService: MetersService
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
    this.getListMeters();
  }

  getListMaterials() {
    this.materialService.getMaterials().subscribe((data: Material[]) => {
     // this.material = data.filter(material => material.quantity >= 1);
     this.material = data
      this.material.sort((a, b) => a.name.localeCompare(b.name));
    });
  }
  getListMeters() {
    this.meterService.getMeters().subscribe((data: Meter[]) => {
      this.meter = data
    });
  }

  updateMeterNameAndCode() {
    const selectedId = this.formMaterial.get('meterId').value;
    const selectedMeter = this.meter.find((m) => m.id === selectedId);
    if (selectedMeter) {
      this.formMaterial.patchValue({
        meterName: selectedMeter.name,
        meterCode: selectedMeter.code,
      });
    }
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
      (material) => material.id === materialId   );
    
    
    return selectedTool ? selectedTool[propertyName] : null;
  }

  getMeterProperty(meterId: string, propertyName: string): any {
    const selectedMeter = this.meter.find((meter) => meter.id === meterId);
    return selectedMeter ? selectedMeter[propertyName] : null;
  }

  addTool() {
    
    const newTool = {
      materialId: this.formMaterial.value.meterId || this.formMaterial.value.materialId,
      assignedQuantity: this.formMaterial.value.assignedQuantity || this.formMaterial.value.assignedQuantityMeter,
      restore: 0,
      assignedAt: this.formMaterial.value.assignedAt,
    };
    
    this.newMaterials.push(newTool);   
    
    this.formMaterial.reset();
  }

  removeMaterial(material: any) {
    const index = this.newMaterials.indexOf(material);
    if (index !== -1) {
      this.newMaterials.splice(index, 1);
      this.newMaterialsChange.emit(this.newMaterials);
    }
  }
}
