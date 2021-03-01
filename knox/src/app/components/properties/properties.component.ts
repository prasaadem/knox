import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { Property } from '../../models/property.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit {
  address: Property[] = [];
  panelOpenState = false;

  constructor(
    private auth: AuthService,
    private propertiesService: PropertyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    try {
      this.address = await this.propertiesService.getProperties(
        this.auth.user.uid
      );
    } catch (e) {
      console.log(e);
    }
  }

  onNavigate(url: string, id: string) {
    this.router.navigate([url, id]);
  }
}
