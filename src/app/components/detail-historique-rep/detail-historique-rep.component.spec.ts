import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHistoriqueRepComponent } from './detail-historique-rep.component';

describe('DetailHistoriqueRepComponent', () => {
  let component: DetailHistoriqueRepComponent;
  let fixture: ComponentFixture<DetailHistoriqueRepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailHistoriqueRepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailHistoriqueRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
