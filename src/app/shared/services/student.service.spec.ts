import { TestBed } from '@angular/core/testing';

import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  const userServiceSpy = jasmine.createSpyObj<StudentService>('StudentService', ['getAllStudents'], );

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call gell all students', () => {
    expect(service.getAllStudents).toBeTruthy();
  });
});
