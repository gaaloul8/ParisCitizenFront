import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilAgentComponent } from './profil-agent.component';

describe('ProfilAgentComponent', () => {
  let component: ProfilAgentComponent;
  let fixture: ComponentFixture<ProfilAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilAgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
