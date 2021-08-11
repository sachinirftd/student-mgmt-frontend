import { gql } from "apollo-angular";

const QueryAndMutation = {
    UPLOAD_FILE_MUTATION: gql`
    mutation file($file: Upload!){uploadFile(file: $file)
    } 
  `,
    DELETE_MUTATION: gql`
  mutation deleteStudent($deleteStudentInput: DeleteStudentInput!){
    deleteStudent(deleteStudentInput: $deleteStudentInput)
  }
`,
    UPDATE_MUTATION: gql`
      mutation ($id: Float!, $name: String!, $email: String!, $age: Float!, $dob: DateTime!) {
        updateStudent(
          updateStudentInput: { id: $id, name: $name, email: $email, age: $age, dob: $dob }
    ) {
     __typename
     }
   }
`,
    GET_ALL_MUTATION: gql`
query{
    user{
      id
      name
      email
      dob
      age
      }
    }`
};

export { QueryAndMutation };