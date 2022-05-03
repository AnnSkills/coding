import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ChartsService } from '../service/charts.service';

import { ChartsComponent } from './charts.component';

describe('Charts Management Component', () => {
  let comp: ChartsComponent;
  let fixture: ComponentFixture<ChartsComponent>;
  let service: ChartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChartsComponent],
    })
      .overrideTemplate(ChartsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChartsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ChartsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.charts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
