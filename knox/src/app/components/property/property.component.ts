import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartType } from 'chart.js';
import { Label, Color, MultiDataSet } from 'ng2-charts';
import { PropertyInfo } from '../../models/info.model';
import { PropertyService } from '../../services/property.service';

class GraphUI {
  lineChartData: ChartDataSets[] = [];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = <ChartType>'line';

  doughnutChartData: MultiDataSet = [];

  condition: string = '';

  constructor(public name: string = '', public subtitle: string = '') {}

  updateLineChartData(data: number[] = [], label: string = '') {
    this.lineChartData = [{ data: data, label: label }];
  }

  updateLineChartLabels(labels: string[] = []) {
    this.lineChartLabels = labels;
  }

  updateLineChartColors(borderColor: string, backgroundColor: string) {
    this.lineChartColors = [
      {
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      },
    ];
  }

  updateLineChartType(value: string) {
    this.lineChartType = <ChartType>value;
  }

  updateDonutData(value: number[]) {
    this.doughnutChartData.push(value);
  }
}
@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
})
export class PropertyComponent implements OnInit {
  propertyId: string = '';
  sub: any;
  info?: PropertyInfo;

  graphs: GraphUI[] = [];

  expectedRent: string = '2500';

  knoxCharge: string = '2';

  insurance: string = '350';

  latLong = {
    lat: 'your latitide',
    long: 'your longitude',
  };

  markers = [
    {
      lat: 'marker latitude',
      long: 'marker longitude',
      labelDetails: {
        text: '.',
        fontWeight: 'normal',
        fontSize: '12px',
        color: 'white',
      },
    },
  ];

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
    try {
      let res: any = await this.pService.fetchPropertyInfoById(this.propertyId);
      this.info = new PropertyInfo(res);
      this.latLong = {
        lat: (this.info || {}).latitude,
        long: (this.info || {}).longitude,
      };
      this.markers = [
        {
          lat: (this.info || {}).latitude,
          long: (this.info || {}).longitude,
          labelDetails: {
            text: '.',
            fontWeight: 'normal',
            fontSize: '12px',
            color: 'white',
          },
        },
      ];
      this.updateGraphs();
    } catch (e) {
      console.log(e);
    }
  }

  updateGraphs() {
    this.graphs = [];
    let graph = new GraphUI(
      'Current Investment Indicator',
      'Details information on investment for this property'
    );
    graph.updateLineChartColors('black', 'rgba(2, 89, 85,1)');
    let data = [
      Number((this.info || {}).priceMax),
      Number((this.info || {}).currentEquity),
      Number((this.info || {}).estimatedValue),
      Number((this.info || {}).marketValueImprovement),
      Number((this.info || {}).priceMin),
      Number((this.info || {}).priceAssessment),
      Number((this.info || {}).assessedValue),
      Number((this.info || {}).marketValue),
    ];

    let labels = [
      'Max sale price'.toUpperCase(),
      'Equity Dollars'.toUpperCase(),
      'ESTIMATED VALUE'.toUpperCase(),
      'Market Value Improvement'.toUpperCase(),
      'Min sale price'.toUpperCase(),
      'Price assessment'.toUpperCase(),
      'Assessed value'.toUpperCase(),
      'Market value'.toUpperCase(),
    ];
    graph.updateLineChartData(data, 'Propery Estimator');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('bar');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Rental Estimate',
      'Details information on this property can be rented for'
    );
    graph.updateLineChartColors('black', 'rgba(2, 89, 85,1)');

    let knoxCharge = Number(
      Number(this.expectedRent) * (Number(this.knoxCharge) / 100)
    );

    let tax = Number((this.info || {}).tax) / 12;
    data = [
      Number((this.info || {}).mtgPi),
      tax,
      Number(this.insurance),
      Number((this.info || {}).mtgPi) + tax + Number(this.insurance),
      knoxCharge,
      Number((this.info || {}).mtgPi) +
        tax +
        Number(this.insurance) +
        knoxCharge,
    ];

    labels = [
      'Monthly loan premium'.toUpperCase(),
      'Monthly tax'.toUpperCase(),
      'Insurance'.toUpperCase(),
      'Breakeven Rent'.toUpperCase(),
      'Charges'.toUpperCase(),
      'Total Rent'.toUpperCase(),
    ];
    graph.updateLineChartData(data, 'Rent Estimator');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('line');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Mortagage Indicator',
      'Details information on motagage for this property'
    );
    graph.updateLineChartColors('black', 'rgba(2, 89, 85,1)');

    let mortagageData = [
      Number((this.info || {}).mtgBalance),
      Number((this.info || {}).mtgPi),
      Number((this.info || {}).mtgPrinciple),
      Number((this.info || {}).mtgInterest),
      Number((this.info || {}).mtgLoan) - Number((this.info || {}).mtgBalance),
    ];

    let mortagageLabels = [
      'Balance'.toUpperCase(),
      'Monthly Payments'.toUpperCase(),
      'Principle'.toUpperCase(),
      'Interest'.toUpperCase(),
      'Amount Cleared'.toUpperCase(),
    ];
    graph.updateDonutData(mortagageData);
    graph.updateLineChartLabels(mortagageLabels);
    graph.updateLineChartType('doughnut');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Cash flow',
      'Details information of cash flow for this property'
    );
    graph.condition = 'displayExpectedRent';

    let profit =
      Number(this.expectedRent) -
      (Number((this.info || {}).mtgPi) +
        tax +
        Number(this.insurance) +
        knoxCharge);
    let expensesData = [
      Number((this.info || {}).mtgPi),
      tax,
      Number(this.insurance),
      knoxCharge,
      profit,
    ];

    let expensesLabels = [
      'Premium'.toUpperCase(),
      'Tax'.toUpperCase(),
      'Insurance'.toUpperCase(),
      'Knox Charge'.toUpperCase(),
      'Profit'.toUpperCase(),
    ];
    graph.updateDonutData(expensesData);
    graph.updateLineChartLabels(expensesLabels);
    graph.updateLineChartType('doughnut');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Property evaluation',
      'How your property was evaluated over the years'
    );
    graph.updateLineChartColors('black', 'rgba(2, 89, 85,1)');

    let saleDate = Number((this.info || {}).saleDate || '');
    let marketYear = Number((this.info || {}).marketYear || '');
    let diffYear = Number(marketYear - saleDate);
    let initialPrice = Number((this.info || {}).mtgLoan);
    let marketValue = Number((this.info || {}).marketValue);
    let roi = Number((marketValue - initialPrice) / diffYear);
    data = [];
    labels = [];
    for (var i = 0; i <= 2 * diffYear; i++) {
      data.push(Number((this.info || {}).mtgLoan) + Number(i) * roi);
      labels.push(`${saleDate + i}`);
    }

    graph.updateLineChartData(data, 'Rent Estimator');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('line');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Rental profit',
      'How your property gains you profit evaluated over the years'
    );
    graph.updateLineChartColors('black', 'rgba(2, 89, 85,1)');

    data = [];
    labels = [];
    for (var i = 0; i <= 2 * diffYear; i++) {
      if (i <= diffYear) data.push(0);
      else data.push(profit + i * profit * 12);
      labels.push(`${saleDate + i}`);
    }

    graph.updateLineChartData(data, 'Rent Estimator');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('bar');

    this.graphs.push(graph);
  }

  get isAirConditioned() {
    return ((this.info || {}).amenities || []).includes('Air_Conditioning');
  }

  get hasFireplace() {
    return ((this.info || {}).amenities || []).includes('Fireplace');
  }

  isDonut(graph: GraphUI) {
    return graph.lineChartType === <ChartType>'doughnut';
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  onChange(event: any) {
    this.expectedRent = `${event.target.value}`;
    this.updateGraphs();
  }

  onChangeCharge(event: any) {
    this.knoxCharge = `${event.target.value}`;
    this.updateGraphs();
  }

  onChangeInsurance(event: any) {
    this.insurance = `${event.target.value}`;
    this.updateGraphs();
  }

  onMarkerClicked(event: any) {
    console.log(event);
  }
}

// Room for more
// Can estimate rental prices if I have historical rental data
// Can estimate depreciation of property
// Implement search on properties
