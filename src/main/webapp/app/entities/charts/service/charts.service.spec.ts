import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICharts, Charts } from '../charts.model';

import { ChartsService } from './charts.service';

describe('Charts Service', () => {
  let service: ChartsService;
  let httpMock: HttpTestingController;
  let elemDefault: ICharts;
  let expectedResult: ICharts | ICharts[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChartsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Charts', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Charts()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Charts', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Charts', () => {
      const patchObject = Object.assign({}, new Charts());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Charts', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Charts', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChartsToCollectionIfMissing', () => {
      it('should add a Charts to an empty array', () => {
        const charts: ICharts = { id: 123 };
        expectedResult = service.addChartsToCollectionIfMissing([], charts);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charts);
      });

      it('should not add a Charts to an array that contains it', () => {
        const charts: ICharts = { id: 123 };
        const chartsCollection: ICharts[] = [
          {
            ...charts,
          },
          { id: 456 },
        ];
        expectedResult = service.addChartsToCollectionIfMissing(chartsCollection, charts);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Charts to an array that doesn't contain it", () => {
        const charts: ICharts = { id: 123 };
        const chartsCollection: ICharts[] = [{ id: 456 }];
        expectedResult = service.addChartsToCollectionIfMissing(chartsCollection, charts);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charts);
      });

      it('should add only unique Charts to an array', () => {
        const chartsArray: ICharts[] = [{ id: 123 }, { id: 456 }, { id: 72127 }];
        const chartsCollection: ICharts[] = [{ id: 123 }];
        expectedResult = service.addChartsToCollectionIfMissing(chartsCollection, ...chartsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const charts: ICharts = { id: 123 };
        const charts2: ICharts = { id: 456 };
        expectedResult = service.addChartsToCollectionIfMissing([], charts, charts2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charts);
        expect(expectedResult).toContain(charts2);
      });

      it('should accept null and undefined values', () => {
        const charts: ICharts = { id: 123 };
        expectedResult = service.addChartsToCollectionIfMissing([], null, charts, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charts);
      });

      it('should return initial array if no Charts is added', () => {
        const chartsCollection: ICharts[] = [{ id: 123 }];
        expectedResult = service.addChartsToCollectionIfMissing(chartsCollection, undefined, null);
        expect(expectedResult).toEqual(chartsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
