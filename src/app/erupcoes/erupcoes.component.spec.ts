import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErupcoesComponent } from './erupcoes.component';

describe('ErupcoesComponent', () => {
  let component: ErupcoesComponent;
  let fixture: ComponentFixture<ErupcoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErupcoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErupcoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
