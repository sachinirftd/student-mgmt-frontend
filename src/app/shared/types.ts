export type Student = {
    id: number;
    name: string;
    dob: string;
    age?: number;
    email: string;
}

export type CreateStudentInput = {
  id: number;
  name: string;
  dob: string;
  age?: number;
  email: string;
}

export type UpdateStudentInput = {
  id: number;
  name: string;
  dob: string;
  email: string;
  age?: number;
}



export type Query = {
    user: Student[];
    sayHello: String;
  }

 export type Mutation = {
    saveStudent(createStudentInput: CreateStudentInput): Student;
    updateStudent(updateStudentInput: UpdateStudentInput): Student;
    deleteStudent(deleteStudentInput: number): number;
    file(file: File): Boolean;
  }