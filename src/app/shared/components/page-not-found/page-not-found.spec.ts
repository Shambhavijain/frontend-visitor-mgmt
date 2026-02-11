import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageNotFound } from './page-not-found';
import { Router } from '@angular/router';
import { constString } from '../../constants/constStr';
import { By } from '@angular/platform-browser';

describe('PageNotFound Component', () => {
  let fixture: ComponentFixture<PageNotFound>;
  let component: PageNotFound;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PageNotFound],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose constString', () => {
    expect(component.constString).toBe(constString);
  });

  it('should navigate to home when onClick is triggered', () => {
    component.onClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate when button is clicked (DOM test)', () => {
    const button = fixture.debugElement.query(By.css('button'));
    if (button) {
      button.triggerEventHandler('click');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    }
  });
});
