import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICharts } from '../charts.model';
import { ChartsService } from '../service/charts.service';

@Component({
  templateUrl: './charts-delete-dialog.component.html',
})
export class ChartsDeleteDialogComponent {
  charts?: ICharts;

  constructor(protected chartsService: ChartsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chartsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
