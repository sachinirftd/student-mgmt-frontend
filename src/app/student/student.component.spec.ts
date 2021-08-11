import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { NotificationModule, NotificationService } from '@progress/kendo-angular-notification';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { GraphQlModule } from '../graph-ql/graph-ql.module';
import { StudentVM } from '../shared/models/student.vm';
import { StudentComponent } from './student.component';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;

  let studentList: StudentVM[];
  let mockObject: any;

  beforeEach(async () => { //re-test the state, to make sure it won't pollute future tests {system under test=> {} <=should be initiated}
    await TestBed.configureTestingModule({
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
        NotificationModule,
        DialogsModule,
        HttpClientModule,
        GraphQlModule,
      ],
      declarations: [StudentComponent],
      providers: [
        FormBuilder,
        Apollo,
        NotificationService
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(function () {
    studentList = [
      {
        id: 1,
        name: "X",
        email: "sach@123",
        dob: new Date("2000-12-12")
      },
      {
        id: 2,
        name: "Y",
        email: "sach@123",
        dob: new Date("2000-12-12")
      }
    ];
    mockObject = jasmine.createSpyObj(['removeHandler', ['saveHandler']]);

  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all data', () => {
    component.getAllData();
    expect(component.getAllData).toBeTruthy();
  });

  it('should select excel to upload', () => {
    component.fileCount = 0;
    component.onSelectEvent('event');
    expect(component.fileCount).toBe(1);
  });

  it('should remove selected upload', () => {
    component.onRemoveEvent('event', 'upload');
    expect(component.fileCount).toBe(0);
  })

  // it('should upload data from excel', () => {
  //   component.onUploadEvent('event');
  //   expect(component.gridData).toBeGreaterThan(0);
  // })

  // it('should remove student', () => {
  //   const event = {
  //     dataItem: {
  //       id: 1
  //     }
  //   }
  //   component.gridData = studentList;
  //   mockObject.removeHandler.and.returnValue(of(true));

  //   // component.removeHandler(event);
  //   expect(component.gridData.length).toBe(1);
  // })


    it('should save students', () => {
    component.gridData.length = 2;
    mockObject.saveHandler.and.returnValue(of(true));
    // component.saveHandler('event');
    expect(component.gridData.length).toBeGreaterThan(0);
  })
});
