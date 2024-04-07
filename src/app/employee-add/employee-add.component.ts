import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeesService } from '../gql/employees.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
})
export class EmployeeAddComponent implements OnInit {
  
  newEmployeeForm!: FormGroup;
  genderList: string[] = ["Male", "Female", "Other"]

  constructor(private employeesService: EmployeesService, private router:Router) {}

  ngOnInit(): void {
    this.newEmployeeForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      gender: new FormControl(''),
      salary: new FormControl(0),
    });
  }

  addEmployee() {
    if (this.newEmployeeForm.valid) {
      this.employeesService.addEmployee(this.newEmployeeForm.value).pipe(
        catchError(error => {
          alert("Cannot Add Employee");
          console.error("Error Adding Employee:", error);
          return of(null);
        })
      ).subscribe(response => {
        if (response && response.addEmployee) {
          alert("Employee added successfully");
          this.newEmployeeForm.reset();
        } else {
          alert("Cannot Add Employee");
        }
      });
    } else {
      alert("Fill out all sections");
    }
  }
}
