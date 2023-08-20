import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedcarComponent } from './selectedcar.component';

describe('SelectedcarComponent', () => {
  let component: SelectedcarComponent;
  let fixture: ComponentFixture<SelectedcarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedcarComponent]
    });
    fixture = TestBed.createComponent(SelectedcarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
