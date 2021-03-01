import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { IProperty, Property } from '../../models/property.model';
import { Router } from '@angular/router';
import { PropertyInfo } from 'src/app/models/info.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit {
  address: Property[] = [];
  panelOpenState = false;
  isAdmin: boolean = false;

  constructor(
    private auth: AuthService,
    private propertiesService: PropertyService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    try {
      this.isAdmin = !!(await this.auth.isAdmin(this.auth.user.uid)).length;
      this.address = await this.propertiesService.getProperties(
        this.auth.user.uid,
        this.isAdmin
      );
      console.log(this.address);
    } catch (e) {
      console.log(e);
    }
  }

  onNavigate(url: string, id: string) {
    this.router.navigate([url, id]);
  }

  async onCanEdit(addr: Property) {
    try {
      addr.canView = !addr.canView;
      await this.propertiesService.updateCanView(addr);
      this.openSnackBar(
        addr.canView
          ? 'Unlocked property details view for user'
          : 'Locked property details view for user'
      );
      await this.refresh();
    } catch (e) {
      console.log(e);
    }
  }

  async updateVisibility(addr: Property) {
    try {
      addr.visibility = !addr.visibility;
      await this.propertiesService.updateVisibility(addr);
      this.openSnackBar(
        addr.visibility ? 'Visible to everyone' : 'Hidden from public view'
      );
      await this.refresh();
    } catch (e) {
      console.log(e);
    }
  }

  async onSupport(property: IProperty, index: number, addr: Property) {
    try {
      property.support_requests = (property.support_requests || []).concat({
        date: new Date().toISOString(),
      });
      addr.properties[index] = property;
      await this.propertiesService.updateSupportRequest(addr);
      this.openSnackBar('Support Requested!!');
    } catch (e) {
      console.log(e);
    }
  }

  totalSupportRequests(addr: Property) {
    return (addr.properties || [])
      .map((p) => p.support_requests || [])
      .reduce((accumulator, value) => accumulator.concat(value), []).length;
  }

  openSnackBar(title: string) {
    this._snackBar.open(title, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
