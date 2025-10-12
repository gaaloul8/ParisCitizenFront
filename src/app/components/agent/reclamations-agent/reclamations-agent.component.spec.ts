import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationsAgentComponent } from './reclamations-agent.component';

describe('ReclamationsAgentComponent', () => {
  let component: ReclamationsAgentComponent;
  let fixture: ComponentFixture<ReclamationsAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReclamationsAgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReclamationsAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
