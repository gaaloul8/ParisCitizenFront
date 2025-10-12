import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsAdminComponent } from './agents-admin.component';

describe('AgentsAdminComponent', () => {
  let component: AgentsAdminComponent;
  let fixture: ComponentFixture<AgentsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentsAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
