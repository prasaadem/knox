import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property.model';
import { AnalyticsService } from '../../services/analytics.service';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-public-properties',
  templateUrl: './public-properties.component.html',
  styleUrls: ['./public-properties.component.scss'],
})
export class PublicPropertiesComponent implements OnInit {
  address: Property[] = [];
  constructor(
    private propertiesService: PropertyService,
    private analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    try {
      this.address = await this.propertiesService.getPublicProperties();
    } catch (e) {
      console.log(e);
    }
  }

  logEvent(a: Property) {
    console.log('called');
    this.analytics.logEvent(
      `User clicked ${a.address} : ${a.id} - a property of ${a.uid}`
    );
  }
}
