import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListUsersComponent } from './pages/users/list-users/list-users.component';
import { AddUserComponent } from './pages/users/add-user/add-user.component';
import { EditUserComponent } from './pages/users/edit-user/edit-user.component';
import { AddEditComponent } from './pages/materials/add-edit-material/add-edit.component';
import { ListComponent } from './pages/materials/list-materials/list.component';
import { ListWarehousesComponent } from './pages/warehouses/list-warehouses/list-warehouses.component';
import { AddEditWarehouseComponent } from './pages/warehouses/add-edit-warehouse/add-edit-warehouse.component';
import { ListProvidersComponent } from './pages/providers/list-providers/list-providers.component';
import { AddEditprovidersComponent } from './pages/providers/add-editproviders/add-editproviders.component';
import { ListCollaboratorsComponent } from './pages/collaborators/list-collaborators/list-collaborators.component';
import { AddEditCollaboratorComponent } from './pages/collaborators/add-edit-collaborator/add-edit-collaborator.component';
import { ListEntriesComponent } from './pages/entries/list-entries/list-entries.component';
import { AddEditEntriesComponent } from './pages/entries/add-edit-entries/add-edit-entries.component';
import { ListTransferComponent } from './pages/transfer/list-transfer/list-transfer.component';
import { ListexitSerieComponent } from './pages/exit-series/listexit-serie/listexit-serie.component';
import { ListexitMaterialsComponent } from './pages/exit-materials/listexit-materials/listexit-materials.component';
import { MeterListComponent } from './pages/materials/meter-list/meter-list.component';
import { AddEditMeterComponent } from './pages/materials/add-edit-meter/add-edit-meter.component';
import { DetailsEntriesComponent } from './pages/entries/details-entries/details-entries.component';
import { AddEditTransferComponent } from './pages/transfer/add-edit-transfer/add-edit-transfer.component';
import { AddEditExitSerialsComponent } from './pages/exit-series/add-edit-exit-serials/add-edit-exit-serials.component';
import { AddEditMaterialsComponent } from './pages/exit-materials/add-edit-materials/add-edit-materials.component';
import { LoadFilesComponent } from './pages/load-files/load-files.component';
import { DetailsExitComponent } from './pages/exit-materials/details-exit/details-exit.component';


export const routes: Routes = [
  { path: '', component: HomeComponent,
   children:[    
  
  { path: 'list-users', component: ListUsersComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user/:id', component: EditUserComponent},
  { path: 'list-materials',component: ListComponent},
  { path: 'add',component: AddEditComponent},
  { path: 'edit/:id',component: AddEditComponent},
  { path: 'list-meters',component: MeterListComponent},
  { path: 'add-meter',component: AddEditMeterComponent},
  { path: 'edit-meter/:id',component: AddEditMeterComponent},
  {path: 'list-warehuses',component:ListWarehousesComponent},
  {path: 'addwarehuse',component:AddEditWarehouseComponent},
  {path: 'editwarehuse/:id',component:AddEditWarehouseComponent},  
  {path: 'list-providers',component:ListProvidersComponent},
  {path: 'addprovider',component:AddEditprovidersComponent},
  {path: 'editprovider/:id',component:AddEditprovidersComponent},
  {path: 'list-collaborators',component:ListCollaboratorsComponent},
  {path: 'addcollaborators',component:AddEditCollaboratorComponent},
  {path: 'editcollaborator/:id',component:AddEditCollaboratorComponent},
  {path: 'list-entries',component:ListEntriesComponent},
  {path: 'details-entries/:id',component:DetailsEntriesComponent},
  {path: 'details-exit/:id',component:DetailsExitComponent},
  {path: 'add-entry',component:AddEditEntriesComponent},
  {path: 'edit-entry/:id',component:AddEditEntriesComponent},
  {path: 'list-trasfers',component:ListTransferComponent},
  {path: 'add-transfer',component:AddEditTransferComponent},
  {path: 'edit-transfer/:id',component:AddEditTransferComponent},
  {path: 'list-exit-series',component:ListexitSerieComponent},
  {path: 'add-exit-series',component:AddEditExitSerialsComponent},
  {path: 'edit-exit-series/:id',component:AddEditExitSerialsComponent},
  {path: 'list-exit-materials',component:ListexitMaterialsComponent},
  {path: 'add-exit-material',component:AddEditMaterialsComponent},
  {path: 'edit-exit-material/:id',component:AddEditMaterialsComponent},
  {path: 'load-file',component:LoadFilesComponent},
]
  }
   ] 

  

@NgModule({
   imports: [ RouterModule.forChild(routes) ],
   exports: [ RouterModule ]
})
export class DashboardRoutingModule { }
