export type Student = {
    id: number;
    name: string;
    dob: Date;
    age: number;
}

export type CreateStudentInput = {
  id: number;
  name: string;
  dob: Date;
  age: number;
  email: string;
}

export type UpdateStudentInput = {
  id: number;
  name: string;
  dob: Date;
  age: number;
  email: string;
}



export type Query = {
    user: Student[];
    sayHello: String;
  }

 export type Mutation = {
    saveStudent(createStudentInput: CreateStudentInput): Student;
    updateStudent(updateStudentInput: UpdateStudentInput): number;
    deleteStudent(deleteStudentInput: number): number;
    file(file: File): Boolean;
  }