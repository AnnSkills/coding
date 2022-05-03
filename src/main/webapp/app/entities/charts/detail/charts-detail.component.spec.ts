import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChartsDetailComponent } from './charts-detail.component';

describe('Charts Management Detail Component', () => {
  let comp: ChartsDetailComponent;
  let fixture: ComponentFixture<ChartsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ charts: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChartsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChartsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load charts on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.charts).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
