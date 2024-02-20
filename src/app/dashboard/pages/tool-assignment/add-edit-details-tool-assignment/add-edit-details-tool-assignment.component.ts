import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tool,} from 'src/app/dashboard/interfaces/tool-assignmentInterface';
import { ToolsService } from 'src/app/dashboard/services/tools.service';

@Component({
  selector: 'add-edit-details-tool-assignment',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  templateUrl: './add-edit-details-tool-assignment.component.html',
  styleUrls: ['./add-edit-details-tool-assignment.component.css'],

})
export class AddEditDetailsToolAssignmentComponent { 

  @Input() tools: any[] = [];
  @Output() toolsChange = new EventEmitter<any[]>();

  toolForm: FormGroup;
  tool:Tool[] = [];
  constructor(private formBuilder: FormBuilder, 
          private toolService: ToolsService) {

           this.toolForm = this.formBuilder.group({
            toolId: ['', Validators.required],
            assignedQuantity: [0, [Validators.required, Validators.min(1)]],
            observation: ['']
         });
     }

  ngOnInit(): void { 
    this.getListTools();   
  } 

  getListTools(){
    this.toolService.getTools()
    .subscribe((data:Tool[]) =>{             
      this.tool = data;      
  });
  }

 
  getToolProperty(toolId: string, propertyName: string): any {
    const selectedTool = this.tool.find(tool => tool.id === toolId);
    return selectedTool ? selectedTool[propertyName] : null;
  }
  
  addTool() { 
    const selectedToolId = this.toolForm.value.toolId;
  const selectedTool = this.tool.find(tool => tool.id === selectedToolId);    
  
        const newTool = {
            toolId: this.toolForm.value.toolId,
            assignedQuantity: this.toolForm.value.assignedQuantity,
            observation: this.toolForm.value.observation,
           
        };
        
        this.tools.push(newTool);
        
        
        this.toolsChange.emit(this.tools);
        this.toolForm.reset();
    
  }

  removeMaterial(material: any) {
    const index = this.tools.indexOf(material);
    if (index !== -1) {
      this.tools.splice(index, 1);
      this.toolsChange.emit(this.tools);
    }
  }


}
