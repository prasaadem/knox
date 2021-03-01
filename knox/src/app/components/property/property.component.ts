import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyInfo } from '../../models/info.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
})
export class PropertyComponent implements OnInit {
  propertyId: string = '';
  sub: any;
  info?: PropertyInfo;

  constructor(
    private _route: ActivatedRoute,
    private pService: PropertyService
  ) {}

  ngOnInit(): void {
    this.sub = this._route.paramMap.subscribe((params) => {
      this.propertyId = params.get('id') || '';
      this.refresh();
    });
  }

  async refresh() {
    console.log(this.propertyId);
    try {
      let res: any = await this.pService.fetchPropertyInfoById(this.propertyId);
      this.info = new PropertyInfo(res);
    } catch (e) {
      console.log(e);
    }
  }

  get isAirConditioned() {
    return ((this.info || {}).amenities || []).includes('Air_Conditioning');
  }

  get hasFireplace() {
    return ((this.info || {}).amenities || []).includes('Fireplace');
  }
}
