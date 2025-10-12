import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitoyensAdminComponent } from './citoyens-admin.component';

describe('CitoyensAdminComponent', () => {
  let component: CitoyensAdminComponent;
  let fixture: ComponentFixture<CitoyensAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitoyensAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitoyensAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
