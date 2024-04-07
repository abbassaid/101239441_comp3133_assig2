import { Component } from '@angular/core';
import { Employee } from '../interfaces/employee';
import { EmployeesService } from '../gql/employees.service'
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
})

export class EmployeeListComponent {

  employees: Employee[] = [];

  constructor(private employeesService: EmployeesService) { }

  async ngOnInit() {
    const employeeList = await this.employeesService.getAllEmployees()
    employeeList.subscribe(employees => {
      this.employees = employees;
    });
  }
  async deleteEmployee(empId: string) {
    try {
      const response = await firstValueFrom(this.employeesService.deleteEmployee(empId));
      if (response && response.deleteEmployeebyId) {
        this.employees = this.employees.filter(emp => emp.id !== empId);
        alert("Employee deleted successfully");
      } else {
        alert("Cannot delete employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Cannot delete employee.");
    }
  }
}
