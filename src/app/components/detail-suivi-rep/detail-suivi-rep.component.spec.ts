import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSuiviRepComponent } from './detail-suivi-rep.component';

describe('DetailSuiviRepComponent', () => {
  let component: DetailSuiviRepComponent;
  let fixture: ComponentFixture<DetailSuiviRepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSuiviRepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSuiviRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
