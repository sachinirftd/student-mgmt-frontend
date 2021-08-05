import { Component, OnInit, Query, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { State } from '@progress/kendo-data-query';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { StudentVM } from '../shared/models/student.vm';
import gql from 'graphql-tag';
import { Student } from '../shared/types';
import { THIS_EXPR, variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StudentComponent implements OnInit {

  studentForm: FormGroup = this.formBuilder.group({
    name: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  uploadSaveUrl = "http://localhost:3000/graphql"; // should represent an actual API endpoint
  uploadRemoveUrl = "http://localhost:3000/graphql"; // should represent an actual API endpoint

  myRestrictions: FileRestrictions = {
    allowedExtensions: [".xlsx"],
  };
  public view: GridDataResult = {
    data: [],
    total: 0
  };

  gridData: StudentVM[] = [];
  isNew: boolean;
  students: StudentVM[] = [];
  allStudents!: Observable<Student[]>;
  private query !: QueryRef<any>;
  public fileCount = 0;

  constructor(private formBuilder: FormBuilder, private apollo: Apollo) {
    this.isNew = false;

    this.query = this.apollo.watchQuery({
      query: gql`
        query{
            user{
              id
              name
              email
              dob
              age
              }
            }`
    });

    this.query.valueChanges.subscribe(result => {
      this.gridData = result.data && result.data.user;
    });
  }

  public ngOnInit(): void {

  }

  get nameController(): AbstractControl | null { return this.studentForm.get('name'); }
  get dobController(): AbstractControl | null { return this.studentForm.get('dob'); }
  get emailController(): AbstractControl | null { return this.studentForm.get('email'); }

  editHandler(event: any) {
    console.log(event, "EDIT EVENT")
    event.sender.editRow(event.rowIndex, this.studentForm);
    this.studentForm = this.formBuilder.group({
      name: this.nameController?.setValue(event.dataItem.name),
      dob: this.dobController?.setValue(event.dataItem.dob),
      email: this.emailController?.setValue(event.dataItem.email)
    });
  }

  cancelHandler(event: any) {

  }

  saveHandler(event: any) {
    this.apollo.mutate({
      mutation: gql`
        mutation{
  updateStudent(updateStudentInput:{id:25, name: "25", email:"fdsfsdf@fdsfsd", age: 70, dob:"2001-11-8" })
}`,
      variables: { updateStudentInput: { id: 2, name: "one", email: "fdsfsdf@fdsfsd", age: 70, dob: "2001-11-8" } }
    }).subscribe(result => {
      // this.gridData = result.data && result.data;
      console.log(result, "RESULTS")
    });


    this.gridData[event.rowIndex] = event.formGroup.value;
    event.sender.closeRow(event.rowIndex);
  }

  removeHandler(event: any) {
    this.gridData.splice(event.rowIndex, 1)
  }

  addHandler(event: any) {

  }

  public onUploadButtonClick(upload: any) {
    upload.uploadFiles();
    console.log(upload, "UPLOAD");
  }

  public onClearButtonClick(upload: any) {
    this.fileCount = 0;
    upload.clearFiles();
  }

  public onSelectEvent(e: any) {
    this.fileCount += 1;
  }

  public onUploadEvent(e: any) {
    this.fileCount = 0;
  }

  public onRemoveEvent(e: any, upload: any) {
    if (this.fileCount > 0) {
      this.fileCount -= 1;
    }
  }
}
