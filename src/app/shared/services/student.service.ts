import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { request } from 'graphql-request';
import { URL } from './../../../assets/environment';
import { QueryAndMutation } from '../graphql';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private apollo: Apollo) { }

  getAllStudents() {
    return this.apollo.watchQuery({
      query: QueryAndMutation.GET_ALL_MUTATION,
      fetchPolicy: "network-only"
    },
    );
  }

  updateStudent(id: number, name: string, email: string, age: number, dob: string) {
    return this.apollo.mutate({
      mutation: QueryAndMutation.UPDATE_MUTATION,
      variables: { id: id, name: name, email: email, age: age,  dob: dob }
    })
  }

  deleteStudent(id: number) {
    return this.apollo.mutate({
      mutation: QueryAndMutation.DELETE_MUTATION,
      variables: {
        deleteStudentInput: { id: id }
      }
    })
  }

  async uploadFile(file: any) {
    return await request(URL.api_graphql, QueryAndMutation.UPLOAD_FILE_MUTATION, {
      file: file
    });
    // return this.apollo.mutate({
    //   mutation: QueryAndMutation.UPLOAD_FILE_MUTATION,
    //   variables: { file: file },
    //   context: {
    //     useMultipart: true
    //   }
    // })
  }
}
