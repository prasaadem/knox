import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss'],
})
export class AddPropertyComponent implements OnInit {
  propertyForm: FormGroup;

  states: string[] = [
    'AL',
    'AK',
    'AS',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FM',
    'FL',
    'GA',
    'GU',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MH',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'MP',
    'OH',
    'OK',
    'OR',
    'PW',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VI',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private propertyService: PropertyService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.propertyForm = this.formBuilder.group({
      address: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zipCode: [null, Validators.required],
    });
  }

  ngOnInit() {}

  async submit() {
    try {
      if (!this.propertyForm.valid) {
        return;
      }
      this.openSnackBar('Adding...');
      var property = {
        ...this.propertyForm.value,
        uid: this.auth.user.uid,
      };
      await this.propertyService.saveProperty(property);
      this.openSnackBar('Property has been added successfully. Redirecting...');
      this.router.navigate(['/properties']);
    } catch (e) {
      console.log(e);
    }
  }

  openSnackBar(title: string) {
    this._snackBar.open(title, 'Close', {
      duration: 500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
