import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Employee, EmployeeResponse, newEmployee } from '../interfaces/employee';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  getAllEmployeesQuery = gql`
    query {
      employees {
        id
        lastName
        firstName
        email
        gender
        salary
      }
    }
  `;

  getEmployeeWithIdQuery = gql`
    query EmployeeById($empId: String!) {
      employeeById(id: $empId) {
        id
        lastName
        firstName
        email
        gender
        salary
      }
    }
  `;

  addNewEmployeeMutation = gql`
    mutation AddEmployee($firstName: String!, $email: String!, $gender: String!, $salary: Float!, $lastName: String!) {
      addEmployee(firstName: $firstName, email: $email, gender: $gender, salary: $salary, lastName: $lastName) {
        message
        employee {
          id
          firstName
          lastName
          email
          gender
          salary
        }
      }
    }
  `;

  deleteEmployeeMutation = gql`
    mutation Mutation($empId: ID!) {
      deleteEmployeebyId(id: $empId) {
        message
      }
    }
  `;

  updateEmployeeMutation = gql`
    mutation UpdateEmployeebyId($empId: String!, $firstName: String, $lastName: String, $email: String, $gender: String, $salary: Float) {
      updateEmployeebyId(id: $empId, firstName: $firstName, lastName: $lastName, email: $email, gender: $gender, salary: $salary) {
        message
        employee {
          id
          firstName
          lastName
          gender
          email
          salary
        }
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.watchQuery<{ employees: Employee[] }>({
      query: this.getAllEmployeesQuery
    }).valueChanges.pipe(
        map(result => result.data.employees)
    );
  }

  getEmployeeWithId(empId: string): Observable<Employee> {
    return this.apollo.watchQuery<{ employeeById: Employee }>({
      query: this.getEmployeeWithIdQuery,
      variables: {
        empId
      }
    }).valueChanges.pipe(
        map(result => result.data.employeeById)
    );
  }

  addEmployee(newEmp: newEmployee): Observable<any> {
    return this.apollo.mutate<EmployeeResponse>({
      mutation: this.addNewEmployeeMutation,
      variables: {
        ...newEmp
      }
    }).pipe(
        map(result => result.data)
    );
  }

  deleteEmployee(empId: string): Observable<any> {
    return this.apollo.mutate<Employee>({
      mutation: this.deleteEmployeeMutation,
      variables: {
        empId
      }
    }).pipe(
        map(result => result.data)
    );
  }

  updateEmployee(empId: string, employeeData: any): Observable<any> {
    return this.apollo.mutate({
      mutation: this.updateEmployeeMutation,
      variables: {
        empId,
        ...employeeData,
      },
    });
  }
}
