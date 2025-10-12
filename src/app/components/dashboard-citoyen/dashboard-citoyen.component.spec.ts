import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCitoyenComponent } from './dashboard-citoyen.component';

describe('DashboardCitoyenComponent', () => {
  let component: DashboardCitoyenComponent;
  let fixture: ComponentFixture<DashboardCitoyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCitoyenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCitoyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
