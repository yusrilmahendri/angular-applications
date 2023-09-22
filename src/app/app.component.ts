import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'crud-angular';
  displayedColumns: string[] = [
    'id', 
    'firstName', 
    'lastName', 
    'email', 
    'dob', 
    'gender', 
    'education',
    'company',
    'experince',
    'package',
    'action'
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    private _dialog:MatDialog, 
    private _empService: EmployeeService,
    private _coreService: CoreService,
    ){}

  ngOnInit(): void {
      this.getEmployeeList();
  }

  openAddEditEmpForm(){
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getEmployeeList();
        }
      }
    });
  }

  getEmployeeList(){
   this._empService.getEmployee().subscribe({
    next:  (res) =>  {
      this.dataSource  = new MatTableDataSource(res); 
      this.dataSource.sort = this.sort;
      this.dataSource.paginator =  this.paginator;
    },  
    error: console.log
   }); 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  destroyEmployee(id: number){
    this._empService.destroyEmployee(id).subscribe({
      next: (res) =>{
        this.getEmployeeList();
        this._coreService.openSnackBar('Employee deleted successfully', 'done');
      },
      error: console.log
    });
  }

  openEditForm(data: any){
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) =>{
        this.getEmployeeList();
      }
    });
  }
}
