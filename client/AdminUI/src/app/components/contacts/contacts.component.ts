import { Component, OnInit, Inject } from '@angular/core';
import { LayoutMainService } from 'src/app/services/layout-main.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface ContactsInfo {
  customer: string;
  first_name: string;
  last_name: string;
  title: string;
  primary_contact: string;
  phone: string;
  email: string;
  notes: string;
}

const contactsData: ContactsInfo[] = [
  { customer: "Wheel of Time", first_name: "Rand", last_name: "al'Thor", title: "Dragon Reborn", primary_contact: "Yes", phone: "(123)456-2000", email: "rand.althor@wot", notes: ""},
  { customer: "Wheel of Time", first_name: "Matrim", last_name: "Cauthon", title: "The Gambler", primary_contact: "No", phone: "(123)456-2001", email: "mat.cauthon@wot", notes: ""},
  { customer: "Wheel of Time", first_name: "Perrin", last_name: "Aybara", title: "Lord Goldeneyes", primary_contact: "No", phone: "(123)456-2002", email: "perrin.aybara@wot", notes: ""},
  { customer: "Lord of the Rings", first_name: "Frodo", last_name: "Baggins", title: "Hobbit", primary_contact: "Yes", phone: "(123)456-2003", email: "frodo.baggins@lotr", notes: ""},
  { customer: "Lord of the Rings", first_name: "Aragorn", last_name: "Elessar", title: "Strider", primary_contact: "No", phone: "(123)456-2004", email: "aragorn.elessar@lotr", notes: ""},
  { customer: "Lord of the Rings", first_name: "Samwise", last_name: "Gamgee", title: "Hobbit", primary_contact: "No", phone: "(123)456-2005", email: "samwise.gamgee@lotr", notes: ""},
  { customer: "Stormlight Archive", first_name: "Kaladin", last_name: "Stormblessed", title: "Knight Radiant", primary_contact: "No", phone: "(123)456-2006", email: "kaladin.stormblessed@sa", notes: ""},
  { customer: "Stormlight Archive", first_name: "Dalinar", last_name: "Kholin", title: "Highprince", primary_contact: "Yes", phone: "(123)456-2007", email: "dalinar.kholin@sa", notes: ""},
  { customer: "Stormlight Archive", first_name: "Shallan", last_name: "Davar", title: "Brightness", primary_contact: "No", phone: "(123)456-2008", email: "shallan.davar@sa", notes: ""},
];

@Component({
  selector: '',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  body_content_height: number;
  dataSource = new MatTableDataSource(contactsData)

  displayedColumns = ["customer",
    "first_name",
    "last_name",
    "title",
    "primary_contact",
    "select"];

  constructor(
    private layoutSvc: LayoutMainService, public dialog: MatDialog) {
    layoutSvc.setTitle('Con-PCA Contacts Page');
  }

  searchFilter = (searchValue: string) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {}
    const dialogRef = this.dialog.open(AddContactDialog, dialogConfig);
  }

  openViewDialog(row: ContactsInfo): void {
    const dialogRef = this.dialog.open(
      ViewContactDialog, {
        data: row
      }
    );
  }

  ngOnInit() {

    // New predicate for filtering.
    // The default predicate will only compare words against a single column.
    // Ex. if you search "Barry Hansen" no results would return because there are two columns...
    // One for first_name and one for last name.
    // This new predicate will search each word against all columns, if a word doesn't match anywhere...
    // no results will be returned.
    this.dataSource.filterPredicate = (data: ContactsInfo, filter: string) => {
      var words = filter.split(' ');

      // Create search data once so it's not created each time in loop
      let searchData = `${data.first_name.toLowerCase()} ${data.last_name.toLowerCase()} ${data.customer.toLowerCase()} ${data.title.toLowerCase()}`

      for (var i = 0; i < words.length; i++) {

        // Don't want to compare bad input
        if (words[i] == null || words[i] == '' || words[i] == ' ') {
          continue;
        }

        // Check if search data contains the word
        var isMatch = searchData.indexOf(words[i].trim().toLowerCase()) > -1;
        
        // If there's no match for the word, return false
        if (!isMatch) {
          return false;
        }
      }
      
      // return true if false was never returned
      return true;
    };
  }
}

@Component({
  selector: 'add-contact-dialog',
  templateUrl: 'dialogues/add-contact-dialog.html'
})
export class AddContactDialog {
  constructor(
    public dialogRef: MatDialogRef<AddContactDialog>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'view-contact-dialog',
  templateUrl: 'dialogues/view-contact-dialog.html'
})
export class ViewContactDialog {
  data: ContactsInfo;
  editDisabled: boolean = true;

  contactFormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    title: new FormControl(),
    customer: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    notes: new FormControl(),
  })

  constructor(
    public dialogRef: MatDialogRef<ViewContactDialog>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.data = data;
      this.contactFormGroup.disable();
    }

  onEditClick(): void {
    if (this.contactFormGroup.disabled) {
      this.contactFormGroup.enable();
    } else {
      this.contactFormGroup.disable();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get diagnostic() {return JSON.stringify(this.data)}
}