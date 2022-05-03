import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChartsService } from '../service/charts.service';
import { ICharts, Charts } from '../charts.model';

import { ChartsUpdateComponent } from './charts-update.component';

describe('Charts Management Update Component', () => {
  let comp: ChartsUpdateComponent;
  let fixture: ComponentFixture<ChartsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chartsService: ChartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChartsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ChartsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChartsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chartsService = TestBed.inject(ChartsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const charts: ICharts = { id: 456 };

      activatedRoute.data = of({ charts });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(charts));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Charts>>();
      const charts = { id: 123 };
      jest.spyOn(chartsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charts }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chartsService.update).toHaveBeenCalledWith(charts);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Charts>>();
      const charts = new Charts();
      jest.spyOn(chartsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charts }));
      saveSubject.complete();

      // THEN
      expect(chartsService.create).toHaveBeenCalledWith(charts);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Charts>>();
      const charts = { id: 123 };
      jest.spyOn(chartsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chartsService.update).toHaveBeenCalledWith(charts);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
