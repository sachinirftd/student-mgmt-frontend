import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { QueryRef } from 'apollo-angular';
import { StudentVM } from '../shared/models/student.vm';
import * as socketClusterClient from 'socketcluster-client';
import { NotificationService } from '@progress/kendo-angular-notification';
import { StudentService } from '../shared/services/student.service';
import { URL } from './../../assets/environment';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentComponent implements OnInit {
  studentForm: FormGroup = this.formBuilder.group({
    id: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl(0),
  });
  uploadSaveUrl = URL.api_apollo; // should represent an actual API endpoint
  uploadRemoveUrl = URL.api_apollo; // should represent an actual API endpoint

  socket = socketClusterClient.create({
    hostname: 'localhost',
    port: 8000,
  });

  myRestrictions: FileRestrictions = {
    allowedExtensions: ['.xlsx'],
  };
  public view: GridDataResult = {
    data: [],
    total: 0,
  };

  gridData: StudentVM[] = [];
  isNew: boolean;
  students: StudentVM[] = [];
  private query!: QueryRef<any>;
  public fileCount = 0;
  pageSize: number = 5;
  skip: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private studentService: StudentService
  ) {
    this.isNew = false;
  }

  async getAllData(): Promise<void> {
    this.query = this.studentService.getAllStudents();
    this.query.valueChanges.subscribe((result) => {
      if (result.data) {
        this.view = {
          data: result.data.user.slice(this.skip, this.skip + this.pageSize),
          total: result.data.user.length,
        };
        this.gridData = result.data.user;
      }
    });
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.view = {
      data: this.gridData.slice(this.skip, this.skip + this.pageSize),
      total: this.gridData.length,
    };
    // this.loadItems();
  }

  public ngOnInit(): void {
    this.getAllData();
  }

  get idController(): AbstractControl | null {
    return this.studentForm.get('id');
  }
  get nameController(): AbstractControl | null {
    return this.studentForm.get('name');
  }
  get dobController(): AbstractControl | null {
    return this.studentForm.get('dob');
  }
  get emailController(): AbstractControl | null {
    return this.studentForm.get('email');
  }
  get ageController(): AbstractControl | null {
    return this.studentForm.get('age');
  }

  /* update data */
  async saveHandler(event: any) {
    const mutation = this.studentService.updateStudent(
      event.formGroup.value.id,
      event.formGroup.value.name,
      event.formGroup.value.email,
      event.formGroup.value.age,
      event.formGroup.value.dob
    );

    mutation.subscribe(() => {
      this.crudNotification("Successfully Updated");
      this.getAllData();
    }),
      () => {
        this.cancelHandler(event);
      };
    event.sender.closeRow(event.rowIndex);
  }

  editHandler(event: any) {
    event.sender.editRow(event.rowIndex, this.studentForm);
    this.studentForm = this.formBuilder.group({
      id: this.idController?.setValue(event.dataItem.id),
      name: this.nameController?.setValue(event.dataItem.name),
      dob: this.dobController?.setValue(event.dataItem.dob),
      email: this.emailController?.setValue(event.dataItem.email),
      age: this.ageController?.setValue(event.dataItem.age),
    });
  }

  cancelHandler(event: any) {
    event.sender.closeRow(event.rowIndex);
  }

  /* remove data from grid */
  removeHandler(event: any): void {
    const id = event.dataItem.id;
    if (!confirm('Are you sure you want to DELETE this file?')) {
      return;
    }
    const mutation = this.studentService.deleteStudent(id);

    mutation.subscribe(
      () => {
        this.crudNotification("Successfully Deleted");
        this.getAllData();
      },
      (err) => {throwError}
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

  /* remove excel */
  public onRemoveEvent(e: any, upload: any) {
    if (this.fileCount > 0) {
      this.fileCount -= 1;
    }
  }

  /* upload excel file and save to db */
  public async onUploadEvent(e: any) {
    e.preventDefault();
    const file = e.files[0].rawFile;

    const mutation = this.studentService.uploadFile(file);

    mutation.then(
      () => {
        this.handleNotification();
      },
      (error) => { throwError }
    );
  }

  /* get notification */
  async handleNotification() {
    // (async () => {
    let myChannel = this.socket.subscribe('myChannel');
    for await (let data of myChannel) {
      if(data) {
        this.notificationService.show({
          content: `Upload : ${data}`,
          animation: { type: 'slide', duration: 5 },
          hideAfter: 5,
          position: { horizontal: 'right', vertical: 'top' },
          type:
            data === 'Success'
              ? { style: 'success', icon: true }
              : { style: 'warning', icon: true },
          closable: true,
        });
        this.getAllData();
      }
    }
    // })();
  }

  public crudNotification(message: string): void {
    this.notificationService.show({
      content: message,
      hideAfter: 600,
      position: { horizontal: 'right', vertical: 'top' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'success', icon: true },
    });
  }

}
