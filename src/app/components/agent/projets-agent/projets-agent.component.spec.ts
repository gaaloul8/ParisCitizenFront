import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetsAgentComponent } from './projets-agent.component';

describe('ProjetsAgentComponent', () => {
  let component: ProjetsAgentComponent;
  let fixture: ComponentFixture<ProjetsAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjetsAgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetsAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
