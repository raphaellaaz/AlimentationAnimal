import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormdataComponent } from './formdata.component';

describe('FormdataComponent', () => {
  let component: FormdataComponent;
  let fixture: ComponentFixture<FormdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormdataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
