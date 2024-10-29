import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuConfigComponent } from './menu-config.component';

describe('MenuConfigComponent', () => {
  let component: MenuConfigComponent;
  let fixture: ComponentFixture<MenuConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
