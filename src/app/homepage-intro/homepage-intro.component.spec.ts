import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageIntroComponent } from './homepage-intro.component';

describe('HomepageIntroComponent', () => {
  let component: HomepageIntroComponent;
  let fixture: ComponentFixture<HomepageIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
