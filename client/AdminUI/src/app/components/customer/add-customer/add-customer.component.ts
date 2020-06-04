import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm, FormGroupDirective, Validators, FormGroup } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../helper/ErrorStateMatcher';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { Contact, Customer } from 'src/app/models/customer.model';
import { Guid } from 'guid-typescript';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LayoutMainService } from 'src/app/services/layout-main.service'
import { Subscription } from 'rxjs';
 
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

   model:any;
   addContact:boolean = false;
   contactDataSource: any = [];
   displayedColumns: string[] = ['name', 'title', 'email', 'mobile_phone', 'office_phone', 'action'];
   contactError='';
   orgError='';
   contacts = new MatTableDataSource<Contact>();
   isEdit: boolean = false;
   tempEditContact:Contact=null;

   matchCustomerName = new MyErrorStateMatcher();
   matchCustomerIdentifier = new MyErrorStateMatcher();
   matchAddress1 = new MyErrorStateMatcher();
   matchCity = new MyErrorStateMatcher();
   matchState = new MyErrorStateMatcher();
   matchZip = new MyErrorStateMatcher();
   
   matchFirstName = new MyErrorStateMatcher();
   matchLastName = new MyErrorStateMatcher();
   matchEmail = new MyErrorStateMatcher();
   
   customerFormGroup = new FormGroup({
    customerName: new FormControl('', [Validators.required]),
    customerIdentifier: new FormControl('', [Validators.required]),
    address1: new FormControl('', [Validators.required]),
    address2: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    sector: new FormControl(null, [Validators.required]),
    industry: new FormControl(null, [Validators.required]),
   });
   
   contactFormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    title: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    office_phone: new FormControl(''),
    mobile_phone: new FormControl(''),
    contactNotes: new FormControl(''),
   });

  // List of angular subscriptions, unsubscribed to on delete
  angularSubscriptions = Array<Subscription>();
  // Customer_uuid if not new
  customer_uuid: string;
  customer: Customer;

  sectorList;
  industryList;

  constructor( 
    public subscriptionSvc: SubscriptionService, 
    public customerSvc: CustomerService, 
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    public router: Router, 
    public layoutSvc: LayoutMainService
  ){ 
    layoutSvc.setTitle('Customers');
  }

  ngOnInit(): void {
    this.angularSubscriptions.push(
      this.route.params.subscribe(params => {
        this.customer_uuid = params['customerId'];
        if (this.customer_uuid != undefined) {
          this.getCustomer()
        } else {
          this.getSectorList()
          //Use preset empty form
        }
      })
    );
  }

  getCustomer() {
    this.customerSvc.getCustomer(this.customer_uuid).subscribe(
    (data: any) => {
      if(data.customer_uuid != null){
        this.customer = data as Customer
        this.setCustomerForm(this.customer)
        this.setContacts(this.customer.contact_list as Contact[])
        this.getSectorList()
      } else {
        this.orgError = "Specified customer UUID not found";
      }
    },
    (error) => {
      this.orgError = "Failed To load customer";
    })
  } 
  getSectorList() {
    this.customerSvc.getSectorList().subscribe(
    (data: any) => {
      if(data) {
        this.sectorList = data
        this.setIndustryList()
      } else {
        this.orgError = "Error retreiving sector/industry list";
      }
    },
    (error) => {
      this.orgError = "Error retreiving sector/industry list";
    })
  }

  setCustomerForm(customer: Customer){    
   this.customerFormGroup.setValue({
     customerName: customer.name,
     customerIdentifier: customer.identifier,
     address1: customer.address_1,
     address2: customer.address_2,
     city: customer.city,
     state: customer.state,
     zip: customer.zip_code,
     sector: customer.sector,
     industry: customer.industry,
   })
  }
  setContacts(contactsList: Contact[]){
    var newContacts = Array<Contact>();
    contactsList.forEach(contact => {
      var contactToAdd : Contact = {
        office_phone: contact.office_phone,
        mobile_phone: contact.mobile_phone,
        email: contact.email,
        first_name: contact.first_name,
        last_name: contact.last_name,
        title: contact.title,
        notes: contact.notes,
        active: true
      };
      newContacts.push(contactToAdd)
      // this.contacts.data.push(contactToAdd)
    });
    this.contacts.data = newContacts
  }

  isExistingCustomer(): boolean {
    if(this.customer_uuid) return true
    return false
  }

  ngOnDestroy() {
    //Unsubscribe from all subscriptions
    this.angularSubscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  createNew(){
    this.clearCustomer();
  }

  pushCustomer(){
    if(this.customerFormGroup.valid && this.contacts.data.length > 0)
    {
      var customer: Customer = {
        customer_uuid: '',
        name: this.customerFormGroup.controls["customerName"].value,
        identifier: this.customerFormGroup.controls["customerIdentifier"].value,
        address_1: this.customerFormGroup.controls["address1"].value,
        address_2: this.customerFormGroup.controls["address2"].value,
        city: this.customerFormGroup.controls["city"].value,
        state: this.customerFormGroup.controls["state"].value,
        zip_code: this.customerFormGroup.controls["zip"].value,
        sector: this.customerFormGroup.controls["sector"].value,
        industry: this.customerFormGroup.controls["industry"].value,
        contact_list: this.contacts.data
      }
      //If editing existing customer
      if(this.customer_uuid != null){ 
        customer.customer_uuid = this.customer_uuid         
        this.angularSubscriptions.push(this.customerSvc.patchCustomer(customer).subscribe((data: any) => {
          this.router.navigate(['/customers']);
        }))
      }
      //else creating a new customer
      else {
        this.customerSvc.addCustomer(customer).subscribe(
          (data: any) => {
            this.cancelCustomer();
            this.dialog.closeAll();
          },(error) => { 
            this.orgError = "Error creating customer";
          })
      }
    } else if( !this.customerFormGroup.valid )
    {
      this.orgError = "Fix required fields";
    } else if( this.contacts.data.length < 1){
      this.orgError = "Please add at least one contact";
    }
  }

  pushContact(){
    if(this.contactFormGroup.valid)
    {
      if(this.isEdit){
        this.removeContact(this.tempEditContact);
        this.tempEditContact = null;
        this.isEdit = false;
      }
      var contact: Contact = {
        office_phone: this.contactFormGroup.controls['office_phone'].value,
        mobile_phone: this.contactFormGroup.controls['mobile_phone'].value,
        email: this.contactFormGroup.controls['email'].value,
        first_name: this.contactFormGroup.controls['firstName'].value,
        last_name: this.contactFormGroup.controls['lastName'].value,
        title: this.contactFormGroup.controls['title'].value,
        notes: this.contactFormGroup.controls['contactNotes'].value,
        active: true
      };
      var previousContacts = this.contacts.data
      previousContacts.push(contact);
      this.contacts.data = previousContacts
      this.clearContact();
    }
    else{
      this.contactError = "Fix required fields."
    }
  }

  editContact(contact:Contact){
    this.isEdit = true;
    this.tempEditContact = contact;
    this.contactFormGroup.controls['office_phone'].setValue(contact.office_phone);
    this.contactFormGroup.controls['mobile_phone'].setValue(contact.mobile_phone);
    this.contactFormGroup.controls['email'].setValue(contact.email);
    this.contactFormGroup.controls['firstName'].setValue(contact.first_name);
    this.contactFormGroup.controls['lastName'].setValue(contact.last_name);
    this.contactFormGroup.controls['title'].setValue(contact.title);
    this.contactFormGroup.controls['contactNotes'].setValue(contact.notes);
    this.showAddContact(true);
  }

  removeContact(contact:Contact){
    const index = this.contacts.data.findIndex(d => d === contact);
    this.contacts.data.splice(index, 1);
    let tempContact = this.contacts;
    this.contacts = new MatTableDataSource<Contact>(tempContact.data);
  }

  clearCustomer(){

    this.customerFormGroup.reset();
    this.contacts = new MatTableDataSource<Contact>();
    this.orgError = '';
  }

  cancelCustomer(){
    if(this.customer_uuid){
      this.router.navigate(['/customers']);
    } else {
      this.clearCustomer();
      this.customerSvc.setCustomerInfo(false)
    }
  }

  clearContact(){
    this.contactFormGroup.reset();
    this.contactError = '';
    this.contactFormGroup.markAsUntouched();
  }

  showAddContact(fromEdit){
    if(fromEdit){
      this.addContact = true;
    } else {
      this.addContact = this.addContact ? false : true;
      if(!this.addContact)
        this.isEdit = false;
      if(!this.addContact)
      {
        this.clearContact();
      }
    }
  }

  checkDataSourceLength(){
    return this.contacts.data.length > 0;
  }

  sectorChange(event){
    this.setIndustryList()
    this.customerFormGroup.patchValue({
      industry: null
    })
  }
  setIndustryList(){
    if(this.sectorSelected()){
      let sector = this.sectorList.filter(x => x.name == this.customerFormGroup.controls["sector"].value)
      this.industryList = sector[0].industries
      console.log(this.industryList)
    }
  }

  sectorSelected(){
    if (this.customerFormGroup.controls["sector"].value != null) {return true;}
    return false
  }
  customerValid(){
    return this.customerFormGroup.valid && this.contacts.data.length > 0
  }
}