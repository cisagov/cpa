import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LayoutMainService } from 'src/app/services/layout-main.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AddCustomerDialogComponent } from './add-customer-dialog/add-customer-dialog.component';
import { Customer } from 'src/app/models/customer.model';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public data_source: MatTableDataSource<Customer>;
  displayed_columns = [
    "name",
    "identifier",
    "address_1",
    "address_2",
    "city",
    "state",
    "zip_code"
  ]

  constructor(
    private layout_service: LayoutMainService,
    public customerSvc: CustomerService,
    public dialog: MatDialog
  ) { 
    layout_service.setTitle('Customers');
    this.customerSvc.setCustomerInfo(false);
  }

  private refresh(): void {
    this.customer_service.getCustomers().subscribe((data: any) => {
    this.data_source.data = data as Customer[];

    }) 
  }

  public open_add_customer_dialog(): void {
    const dialog_config = new MatDialogConfig();
    dialog_config.data = {}
    const dialog_ref = this.dialog.open(AddCustomerDialogComponent, dialog_config);

    dialog_ref.afterClosed().subscribe(value => {
      this.refresh();
    })
  }

  public setCustomer(uuid){
    this.customerSvc.selectedCustomer = uuid;
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    this.data_source = new MatTableDataSource();
    this.refresh();
  }

}
