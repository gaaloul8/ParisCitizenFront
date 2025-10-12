import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalitesAdminComponent } from './municipalites-admin.component';

describe('MunicipalitesAdminComponent', () => {
  let component: MunicipalitesAdminComponent;
  let fixture: ComponentFixture<MunicipalitesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MunicipalitesAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MunicipalitesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
