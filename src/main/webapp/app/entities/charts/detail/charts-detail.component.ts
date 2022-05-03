import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICharts } from '../charts.model';

@Component({
  selector: 'anna-charts-detail',
  templateUrl: './charts-detail.component.html',
})
export class ChartsDetailComponent implements OnInit {
  charts: ICharts | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charts }) => {
      this.charts = charts;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
