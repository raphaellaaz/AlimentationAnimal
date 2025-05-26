import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAvanzadoComponent } from './usuario-avanzado.component';

describe('UsuarioAvanzadoComponent', () => {
  let component: UsuarioAvanzadoComponent;
  let fixture: ComponentFixture<UsuarioAvanzadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioAvanzadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioAvanzadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
