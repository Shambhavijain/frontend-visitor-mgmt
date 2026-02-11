import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Unauthorized } from './unauthorized';
import { Router } from '@angular/router';
import { constString } from '../../constants/constStr';
import { By } from '@angular/platform-browser';

describe('Unauthorized Component', () => {
  let fixture: ComponentFixture<Unauthorized>;
  let component: Unauthorized;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Unauthorized],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Unauthorized);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose constString', () => {
    expect(component.constString).toBe(constString);
  });

  it('should navigate to login with replaceUrl true', () => {
    component.goToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/login'],
      { replaceUrl: true }
    );
  });

  it('should navigate when login button is clicked (DOM)', () => {
    const button = fixture.debugElement.query(By.css('button'));
    if (button) {
      button.triggerEventHandler('click');
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/login'],
        { replaceUrl: true }
      );
    }
  });
});
