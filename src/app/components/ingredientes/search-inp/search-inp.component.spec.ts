import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInpComponent } from './search-inp.component';

describe('SearchInpComponent', () => {
  let component: SearchInpComponent;
  let fixture: ComponentFixture<SearchInpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
