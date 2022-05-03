import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICharts } from '../charts.model';
import { ChartsService } from '../service/charts.service';
import { ChartsDeleteDialogComponent } from '../delete/charts-delete-dialog.component';

@Component({
  selector: 'anna-charts',
  templateUrl: './charts.component.html',
})
export class ChartsComponent implements OnInit {
  charts?: ICharts[];
  isLoading = false;

  constructor(protected chartsService: ChartsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.chartsService.query().subscribe({
      next: (res: HttpResponse<ICharts[]>) => {
        this.isLoading = false;
        this.charts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICharts): number {
    return item.id!;
  }

  delete(charts: ICharts): void {
    const modalRef = this.modalService.open(ChartsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.charts = charts;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
