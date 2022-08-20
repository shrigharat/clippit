import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipsisLoaderComponent } from './ellipsis-loader.component';

describe('EllipsisLoaderComponent', () => {
  let component: EllipsisLoaderComponent;
  let fixture: ComponentFixture<EllipsisLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EllipsisLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EllipsisLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
