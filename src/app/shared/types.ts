export type Student = {
    id: number;
    name: string;
    dob: Date;
    age: number;
}

export type Query = {
    user: Student[];
    sayHello: String;
  }

 export type Mutation = {
    saveStudent(createStudentInput: Student): Student;
    updateStudent(updateStudentInput: Student): number;
    deleteStudent(deleteStudentInput: number): number;
    // uploadFile(file: FileUpload): Boolean!
  }