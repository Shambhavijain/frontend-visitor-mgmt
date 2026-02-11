import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { constString } from '../../constants/constStr';

describe('Footer Component', () => {
  let fixture: ComponentFixture<Footer>;
  let component: Footer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer]
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose constString', () => {
    expect(component.constString).toBe(constString);
  });

  it('should render footer text from constString', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(constString.footername);
  });

  it('should contain footer CSS class', () => {
    const footer = fixture.nativeElement.querySelector('footer');
    expect(footer).toBeTruthy();
  });
});
