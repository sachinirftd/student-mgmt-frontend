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
import { Student, UpdateStudentInput } from '../shared/types';
import { THIS_EXPR, variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StudentComponent implements OnInit {

  studentForm: FormGroup = this.formBuilder.group({
    id: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl(0)
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

    this.getAllData();

    // this.query = this.apollo.watchQuery({
    //   query: gql`
    //     query{
    //         user{
    //           id
    //           name
    //           email
    //           dob
    //           age
    //           }
    //         }`
    // });

    // this.query.valueChanges.subscribe(result => {
    //   this.gridData = result.data && result.data.user;
    // });
  }

  getAllData(): void {
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
            }`,
      fetchPolicy: "network-only"
    },
    );

    this.query.valueChanges.subscribe(result => {
      this.gridData = result.data && result.data.user;
    });
  }

  public ngOnInit(): void {

  }

  get idController(): AbstractControl | null { return this.studentForm.get('id'); }
  get nameController(): AbstractControl | null { return this.studentForm.get('name'); }
  get dobController(): AbstractControl | null { return this.studentForm.get('dob'); }
  get emailController(): AbstractControl | null { return this.studentForm.get('email'); }
  get ageController(): AbstractControl | null { return this.studentForm.get('age'); }

  editHandler(event: any) {
    console.log(event, "EDIT EVENT")
    event.sender.editRow(event.rowIndex, this.studentForm);
    this.studentForm = this.formBuilder.group({
      id: this.idController?.setValue(event.dataItem.id),
      name: this.nameController?.setValue(event.dataItem.name),
      dob: this.dobController?.setValue(event.dataItem.dob),
      email: this.emailController?.setValue(event.dataItem.email),
      age: this.ageController?.setValue(event.dataItem.age)
    });
  }

  cancelHandler(event: any) {
    event.sender.closeRow(event.rowIndex)
  }

  saveHandler(event: any) {
    // const data: UpdateStudentInput = {
    //   id: event.formGroup.value.id,
    //   name: event.formGroup.value.name,
    //   age: event.formGroup.value.age,
    //   dob: event.formGroup.value.dob,
    //   email: event.formGroup.value.email
    // };

    const id = event.formGroup.value.id;
    const name = event.formGroup.value.name;
    const age = event.formGroup.value.age;
    const dob = event.formGroup.value.dob;
    const email = event.formGroup.value.email;
    //{ id: id , name: name, dob: dob, age: age, email: email}

    console.log(id, "IDDD")
    const updatedMutation = gql`
           mutation ($id: Float!, $name: String!, $email: String!, $age: Float!, $dob: DateTime!) {
            updateStudent(
              updateStudentInput: { id: $id, name: $name, email: $email, age: $age, dob: $dob }
               ) {
                __typename
                }
              }
      `
    this.apollo.mutate({
      mutation: updatedMutation,
      variables: { id: id, name: name, email: email, age: age, dob: dob }
    }).subscribe(result => this.getAllData(),
      err => err
    );
    // this.apollo.mutate({
    //   mutation: gql`
    //       mutation updateStudent ($updateStudentInput: UpdateStudentInput!){
    //         updateStudent (updateStudentInput: $updateStudentInput)
    //       }
    //     `,
    //   variables: { updateStudentInput: { id: id } }
    //   // variables: { updateStudentInput : {id: ${id}, name: ${name},email:${email},age: ${age},dob: ${dob} }   }
    // }).subscribe(result => {
    //   // this.gridData = result.data && result.data;
    //   console.log(result, "RESULTS")
    // });

    this.gridData[event.rowIndex] = event.formGroup.value;
    event.sender.closeRow(event.rowIndex);
  }

  removeHandler(event: any) {
    this.gridData.splice(event.rowIndex, 1)
    const id = event.dataItem.id;


    const deleteMutation = gql`
    mutation deleteStudent($deleteStudentInput: DeleteStudentInput!){
      deleteStudent(deleteStudentInput: $deleteStudentInput)
    }
`

    this.apollo.mutate<any>({
      mutation: deleteMutation,
      variables: {
        deleteStudentInput: { id: id }
      }
    }).subscribe(result => this.getAllData(),
      err => err
    );
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

    const file = e.files[0].rawFile;

    const uploadFileMutation = gql`
    mutation file($file: Upload!) {
      uploadFile(file: $file) 
    } 
  `
    let isSuccess: boolean = false;

    this.apollo.mutate<any>({
      mutation: uploadFileMutation,
      variables: {
        file: file
      },
      context: {
        useMultipart: true
      }
    }).subscribe(result => this.getAllData(),
      err => !isSuccess
    );


  }

  public onRemoveEvent(e: any, upload: any) {
    if (this.fileCount > 0) {
      this.fileCount -= 1;
    }
  }
}
