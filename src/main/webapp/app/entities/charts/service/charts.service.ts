import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICharts, getChartsIdentifier } from '../charts.model';

export type EntityResponseType = HttpResponse<ICharts>;
export type EntityArrayResponseType = HttpResponse<ICharts[]>;

@Injectable({ providedIn: 'root' })
export class ChartsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/charts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(charts: ICharts): Observable<EntityResponseType> {
    return this.http.post<ICharts>(this.resourceUrl, charts, { observe: 'response' });
  }

  update(charts: ICharts): Observable<EntityResponseType> {
    return this.http.put<ICharts>(`${this.resourceUrl}/${getChartsIdentifier(charts) as number}`, charts, { observe: 'response' });
  }

  partialUpdate(charts: ICharts): Observable<EntityResponseType> {
    return this.http.patch<ICharts>(`${this.resourceUrl}/${getChartsIdentifier(charts) as number}`, charts, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICharts>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICharts[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChartsToCollectionIfMissing(chartsCollection: ICharts[], ...chartsToCheck: (ICharts | null | undefined)[]): ICharts[] {
    const charts: ICharts[] = chartsToCheck.filter(isPresent);
    if (charts.length > 0) {
      const chartsCollectionIdentifiers = chartsCollection.map(chartsItem => getChartsIdentifier(chartsItem)!);
      const chartsToAdd = charts.filter(chartsItem => {
        const chartsIdentifier = getChartsIdentifier(chartsItem);
        if (chartsIdentifier == null || chartsCollectionIdentifiers.includes(chartsIdentifier)) {
          return false;
        }
        chartsCollectionIdentifiers.push(chartsIdentifier);
        return true;
      });
      return [...chartsToAdd, ...chartsCollection];
    }
    return chartsCollection;
  }
}
