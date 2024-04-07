import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeesService } from '../gql/employees.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../interfaces/employee';

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
})
export class EmployeeUpdateComponent implements OnInit {

  updateEmployeeForm: FormGroup;

  employeeID: string = "";
  genderList: string[] = ["Male", "Female", "Other"];

  constructor(private employeesService: EmployeesService, private route: ActivatedRoute) {
    this.updateEmployeeForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      gender: new FormControl(''),
      salary: new FormControl(0)
    });
  }

  ngOnInit() {

    this.employeeID = this.route.snapshot.params['empID'];
    this.getEmployeeDetails();
  }

  getEmployeeDetails() {
    if (!this.employeeID) {
      console.error('No employee with that ID');
      return;
    }
    this.employeesService.getEmployeeWithId(this.employeeID).subscribe({
      next: (employee: Employee) => {
        this.updateEmployeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          gender: employee.gender,
          salary: employee.salary
        });
      },
      error: (error) => console.error('Cannot get specific employee:', error)
    });
  }

  updateEmployee() {
    if (!this.employeeID) {
      console.error('Employee ID is taken');
      return;
    }
    this.employeesService.updateEmployee(this.employeeID, this.updateEmployeeForm.value)
      .pipe(
        catchError((error) => {
          console.error("Error updating employee:", error);
          alert("Error updating, try again later...");
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          // Adjusted to match the mutation response structure
          if (response && response.data.updateEmployeebyId) {
            alert("Employee updated successfully");
          } else {
            console.error('Error with code:', response);
            alert("Failed to update employee try again later...");
          }
        },
        error: (error) => {
          // Handle the case where the GraphQL request itself fails
          console.error('Error updating employee:', error);
          alert("Cannot update employee, try again later...");
        }
      });
  }
}
