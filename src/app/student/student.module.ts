import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { UploadsModule } from '@progress/kendo-angular-upload';

const routes: Routes = [
  { path: '', component: StudentComponent }
];

@NgModule({
  declarations: [
    StudentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LabelModule,
    InputsModule,
    DateInputsModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    DropDownsModule,
    UploadsModule,
    RouterModule.forChild(routes),
  ]
})
export class StudentModule { }
