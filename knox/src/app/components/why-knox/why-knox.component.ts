import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'chart.js';
import { PropertyInfo } from '../../models/info.model';
import { PropertyService } from '../../services/property.service';
import { GraphUI } from '../property/property.component';
import { Loan } from '@dazlab-team/loan-calc';
import * as _ from 'underscore';

@Component({
  selector: 'app-why-knox',
  templateUrl: './why-knox.component.html',
  styleUrls: ['./why-knox.component.scss'],
})
export class WhyKnoxComponent implements OnInit {
  propertyId: string = '';
  sub: any;
  info?: PropertyInfo;

  graphs: GraphUI[] = [];

  graphForm: FormGroup;

  constructor(
    private _route: ActivatedRoute,
    private pService: PropertyService,
    private formBuilder: FormBuilder
  ) {
    this.graphForm = this.formBuilder.group({
      purchaseValue: [100000, Validators.required],
      purchaseYear: [2015, Validators.required],
      apr: [3, Validators.required],
      downpaymentRate: [2, Validators.required],
      propertyTaxRate: [2, Validators.required],
      mortgagePeriod: [120, Validators.required],
      premium: [1000, Validators.required],
      tax: [100, Validators.required],
      insurance: [150, Validators.required],
      expectedRent: [2500, Validators.required],
      knoxCharge: [10, Validators.required],
      marketValue: [150000, Validators.required],
    });
  }

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
      this.updateGraphs();
    } catch (e) {
      console.log(e);
    }
  }

  async submit() {
    try {
      if (!this.graphForm.valid) {
        return;
      }

      this.updateGraphs();
    } catch (e) {
      console.log(e);
    }
  }

  updateGraphs() {
    let {
      purchaseValue,
      apr,
      marketValue,
      downpaymentRate,
      mortgagePeriod,
      propertyTaxRate,
      premium,
      tax,
      insurance,
      expectedRent,
      knoxCharge,
      purchaseYear,
    } = this.graphForm.value;

    let loan = new Loan();
    loan.amount = purchaseValue;
    loan.years = mortgagePeriod / 12;
    loan.interestRate = apr;
    loan.rounding = 0;

    this.graphs = [];
    let graph = new GraphUI(
      'Mortgage Overview',
      'Information about your mortgage'
    );
    graph.updateLineChartColors('black', 'rgba(2, 89, 85,1)');
    let data = [
      loan.totalCost,
      loan.totalCost - loan.totalInterest,
      loan.totalInterest,
    ];

    let labels = [
      'Total Cost'.toUpperCase(),
      'Principle'.toUpperCase(),
      'Interest'.toUpperCase(),
    ];
    graph.updateLineChartData(data, 'Mortgage Overview');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('bar');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Mortgage Overview (monthly)',
      'Monthly Information about your mortgage'
    );
    graph.updateLineChartColors('black', 'rgb(201, 186, 57)');
    data = loan.payments.map((p) => p.balance);

    labels = _.range(mortgagePeriod).map((i: number) => `${i + 1}`);
    graph.updateLineChartData(data, 'Mortgage Overview (monthly)');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('bar');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Principle Overview (monthly)',
      'Monthly Information about your principle'
    );
    graph.updateLineChartColors('black', 'rgb(57, 201, 153)');
    data = loan.payments.map((p) => p.principal);

    labels = _.range(mortgagePeriod).map((i: number) => `${i + 1}`);
    graph.updateLineChartData(data, 'Principle Overview (monthly)');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('bar');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Interest Overview (monthly)',
      'Monthly Information about your interest'
    );
    graph.updateLineChartColors('black', '207, 39, 39');
    data = loan.payments.map((p) => p.interest);

    labels = _.range(mortgagePeriod).map((i: number) => `${i + 1}`);
    graph.updateLineChartData(data, 'Interest Overview (monthly)');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('bar');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Monthly expenses Overview',
      'Monthly Information about your expenses'
    );
    graph.updateLineChartColors('black', 'rgb(118, 56, 87)');

    var totalExpensesMonthly = premium + tax + insurance;
    var profitsEarnedMonthly = expectedRent - totalExpensesMonthly;
    data = [
      premium,
      tax,
      insurance,
      totalExpensesMonthly,
      expectedRent,
      profitsEarnedMonthly,
    ];

    labels = [
      'premium'.toUpperCase(),
      'tax'.toUpperCase(),
      'insurance'.toUpperCase(),
      'total'.toUpperCase(),
      'rent'.toUpperCase(),
      'profit'.toUpperCase(),
    ];
    graph.updateLineChartData(data, 'Expenses Overview (monthly)');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('bar');

    this.graphs.push(graph);

    graph = new GraphUI(
      'Propery evaluation',
      'Detailed property current evaluation'
    );
    graph.updateLineChartColors('black', 'rgb(255, 171, 115)');

    var difference = Number(marketValue) - Number(purchaseValue);
    data = [purchaseValue, marketValue, difference];

    labels = [
      'purchase value'.toUpperCase(),
      'market value'.toUpperCase(),
      'Difference'.toUpperCase(),
    ];
    graph.updateLineChartData(data, 'Property evaluation');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('bar');

    this.graphs.push(graph);

    graph = new GraphUI('Knox Benefits', 'Advantages of knox');
    graph.updateLineChartColors('black', 'rgb(2, 89, 85)');

    var months = this.monthDifference(
      new Date(`01/01/${purchaseYear}`),
      new Date()
    );
    var monthsLeft = mortgagePeriod - months;
    var knox_charge_monthly = (expectedRent * knoxCharge) / 100;
    var knox_charge = knox_charge_monthly * monthsLeft;
    var price_after_mortgate_period =
      marketValue + 0.75 * marketValue - purchaseValue;
    var profits_with_knox = (profitsEarnedMonthly - knoxCharge) * monthsLeft;

    data = [
      difference,
      knox_charge,
      profits_with_knox,
      price_after_mortgate_period,
      profits_with_knox + price_after_mortgate_period,
    ];

    labels = [
      'Your current profits'.toUpperCase(),
      'knox charge'.toUpperCase(),
      'rental profits'.toUpperCase(),
      'Net value of property'.toUpperCase(),
      'Profits with knox'.toUpperCase(),
    ];
    graph.updateLineChartData(data, 'Knox benefits');
    graph.updateLineChartLabels(labels);
    graph.updateLineChartType('bar');

    this.graphs.push(graph);

    let propertyTax = (purchaseValue * propertyTaxRate) / 1200;
  }

  isDonut(graph: GraphUI) {
    return graph.lineChartType === <ChartType>'doughnut';
  }

  monthDifference(d1: Date, d2: Date) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
}
