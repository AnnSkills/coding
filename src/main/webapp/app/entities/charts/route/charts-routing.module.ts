import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChartsComponent } from '../list/charts.component';
import { ChartsDetailComponent } from '../detail/charts-detail.component';
import { ChartsUpdateComponent } from '../update/charts-update.component';
import { ChartsRoutingResolveService } from './charts-routing-resolve.service';

const chartsRoute: Routes = [
  {
    path: '',
    component: ChartsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChartsDetailComponent,
    resolve: {
      charts: ChartsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChartsUpdateComponent,
    resolve: {
      charts: ChartsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChartsUpdateComponent,
    resolve: {
      charts: ChartsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chartsRoute)],
  exports: [RouterModule],
})
export class ChartsRoutingModule {}
