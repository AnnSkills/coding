import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICharts, Charts } from '../charts.model';
import { ChartsService } from '../service/charts.service';

@Injectable({ providedIn: 'root' })
export class ChartsRoutingResolveService implements Resolve<ICharts> {
  constructor(protected service: ChartsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICharts> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((charts: HttpResponse<Charts>) => {
          if (charts.body) {
            return of(charts.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Charts());
  }
}
