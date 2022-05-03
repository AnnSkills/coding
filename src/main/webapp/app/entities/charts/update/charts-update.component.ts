import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICharts, Charts } from '../charts.model';
import { ChartsService } from '../service/charts.service';

@Component({
  selector: 'anna-charts-update',
  templateUrl: './charts-update.component.html',
})
export class ChartsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected chartsService: ChartsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charts }) => {
      this.updateForm(charts);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const charts = this.createFromForm();
    if (charts.id !== undefined) {
      this.subscribeToSaveResponse(this.chartsService.update(charts));
    } else {
      this.subscribeToSaveResponse(this.chartsService.create(charts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharts>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(charts: ICharts): void {
    this.editForm.patchValue({
      id: charts.id,
    });
  }

  protected createFromForm(): ICharts {
    return {
      ...new Charts(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}
