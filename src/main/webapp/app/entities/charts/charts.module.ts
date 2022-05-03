import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChartsComponent } from './list/charts.component';
import { ChartsDetailComponent } from './detail/charts-detail.component';
import { ChartsUpdateComponent } from './update/charts-update.component';
import { ChartsDeleteDialogComponent } from './delete/charts-delete-dialog.component';
import { ChartsRoutingModule } from './route/charts-routing.module';

@NgModule({
  imports: [SharedModule, ChartsRoutingModule],
  declarations: [ChartsComponent, ChartsDetailComponent, ChartsUpdateComponent, ChartsDeleteDialogComponent],
  entryComponents: [ChartsDeleteDialogComponent],
})
export class ChartsModule {}
