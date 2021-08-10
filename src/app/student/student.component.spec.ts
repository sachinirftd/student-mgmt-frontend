import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentComponent } from './student.component';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;

  beforeEach(async () => { //re-test the state, to make sure it won't pollute future tests {system under test=> {} <=should be initiated}
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [StudentComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove item from grid', () => {
    component.removeHandler(()=> {
      expect(component.gridData.length).toEqual(component.fileCount);
    })
  });


  it('app dummy test', () => {
    expect(1).toBe(1);
  });

  it('should test get all results', () => {
      component.getAllData();
      expect(component.getAllData.length).toBeGreaterThan(0)
  });
});
