import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { StudentVM } from '../shared/models/student.vm';
import gql from 'graphql-tag';
import { Student } from '../shared/types';
import * as socketClusterClient from 'socketcluster-client';
import { NotificationService } from '@progress/kendo-angular-notification';
import { QueryAndMutation } from '../shared/graphql';

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

  socket = socketClusterClient.create({
    hostname: 'localhost',
    port: 8000
  });


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

  constructor(private formBuilder: FormBuilder, private apollo: Apollo, private notificationService: NotificationService) {
    this.isNew = false;
    this.getAllData();
  }

  async getAllData(): Promise<void> {
    this.query = this.apollo.watchQuery({
      query: QueryAndMutation.GET_ALL_MUTATION,
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

  /* update data */
  async saveHandler(event: any) {
    this.apollo.mutate({
      mutation: QueryAndMutation.UPDATE_MUTATION,
      variables: { id: event.formGroup.value.id, name: event.formGroup.value.name, email: event.formGroup.value.email, age: event.formGroup.value.age, dob: event.formGroup.value.dob }
    }).subscribe(({ data }) => {
      this.getAllData();
    }, () => {
      this.cancelHandler(event);
    });

    event.sender.closeRow(event.rowIndex);
  }

  editHandler(event: any) {
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

  /* remove data from grid */
  removeHandler(event: any) {
    const id = event.dataItem.id;
    if(!confirm("Are you sure you want to DELETE this file?")) {
      return;
    }
    this.apollo.mutate<any>({
      mutation: QueryAndMutation.DELETE_MUTATION,
      variables: {
        deleteStudentInput: { id: id }
      }
    }).subscribe(async () => {
      this.getAllData();
    },
      err => console.log('there was an error sending the query', err)
    );
  }

  public async onUploadButtonClick(upload: any) {
    upload.uploadFiles();
  }

  public onClearButtonClick(upload: any) {
    this.fileCount = 0;
    upload.clearFiles();
  }

  public onSelectEvent(e: any) {
    this.fileCount += 1;
  }

  /* upload excel file and save to db */
  public async onUploadEvent(e: any) {
    e.preventDefault();
    const file = e.files[0].rawFile;
 
    let isSuccess = false;

    this.apollo.mutate<any>({
      mutation: QueryAndMutation.UPLOAD_FILE_MUTATION,
      variables: { file: file },
      context: {
        useMultipart: true
      }
    }).subscribe(
      () => {
        isSuccess= true;
      },
      err => err
    );
    /* get notification */
    (async () => {
      let myChannel = this.socket.subscribe('myChannel');
      for await (let data of myChannel) {
        this.notificationService.show({
          content: `Upload : ${data}`,
          animation: { type: 'slide', duration: 400 },
          position: { horizontal: 'right', vertical: 'top' },
          type: data === 'Success' ? { style: 'success', icon: true } : { style: 'warning', icon: true },
          closable: true
        });
      }
    })();
    if(isSuccess) {
      this.getAllData();
    }
  }
  /* remove excel */
  public onRemoveEvent(e: any, upload: any) {
    if (this.fileCount > 0) {
      this.fileCount -= 1;
    }
  }
}
